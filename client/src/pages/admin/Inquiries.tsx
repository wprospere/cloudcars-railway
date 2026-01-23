import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/_core/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Mail,
  Phone,
  Download,
  Clock,
  User,
  Link as LinkIcon,
  Eye,
  RotateCcw,
} from "lucide-react";
import { timeAgo, getUrgency, getUrgencyColor } from "@/lib/timeUtils";

// ✅ Completion badge helper
import { getDriverCompletionBadge } from "@/lib/driverCompletion";

/* ---------------- Unassigned-first sort helper ---------------- */
type MaybeString = string | null | undefined;

function sortUnassignedFirst<T>(
  rows: T[],
  getAssignee: (row: T) => MaybeString,
  getCreatedAt?: (row: T) => number
) {
  return rows
    .map((row, idx) => ({ row, idx }))
    .sort((a, b) => {
      const aAssigned = !!getAssignee(a.row);
      const bAssigned = !!getAssignee(b.row);

      // Unassigned first
      if (aAssigned !== bAssigned) return aAssigned ? 1 : -1;

      // Optional: newest first within group
      if (getCreatedAt) {
        const at = getCreatedAt(a.row);
        const bt = getCreatedAt(b.row);
        if (at !== bt) return bt - at;
      }

      // Stable tiebreak
      return a.idx - b.idx;
    })
    .map((x) => x.row);
}

/* ---------------- CSV Export ---------------- */
function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0] ?? {});
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => JSON.stringify(row?.[h] ?? "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- Helpers ---------------- */
function normalizeArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    for (const key of [
      "items",
      "data",
      "rows",
      "results",
      "applications",
      "inquiries",
      "messages",
    ]) {
      const v = (value as any)[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function LoadingCard({ text }: { text: string }) {
  return <Card className="p-6 text-center text-muted-foreground">{text}</Card>;
}

function ErrorCard({ title, message }: { title: string; message?: string }) {
  if (!message) return null;
  return (
    <Card className="p-4 border border-destructive/40 bg-destructive/10">
      <div className="font-semibold">{title}</div>
      <div className="text-sm mt-1">{message}</div>
    </Card>
  );
}

function openAdminReview(driverApplicationId: number) {
  // wouter route exists: /admin/driver-onboarding/:id
  window.location.href = `/admin/driver-onboarding/${driverApplicationId}`;
}

/* ---------------- Page ---------------- */
export default function Inquiries() {
  // Keep existing behavior, but also capture whatever it returns (if anything)
  const auth: any = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/admin/login",
  });

  // "Assigned to me" relies on name matching your assignedTo values (which are names)
  const myNameRaw =
    auth?.user?.name ??
    auth?.admin?.name ??
    auth?.profile?.name ??
    auth?.name ??
    null;

  const myName =
    typeof myNameRaw === "string" && myNameRaw.trim()
      ? myNameRaw.trim()
      : null;

  const [activeTab, setActiveTab] = useState("drivers");

  // ✅ Option A: Active vs Archived view for drivers
  const [driverView, setDriverView] = useState<"active" | "archived">("active");

  // ✅ filter drivers list (client-side)
  const [driverFilter, setDriverFilter] = useState<"all" | "unassigned">("all");

  // ✅ NEW: quick assignment filters
  type AssignmentQuickFilter = "all" | "mine" | "others";
  const [assignmentQuickFilter, setAssignmentQuickFilter] =
    useState<AssignmentQuickFilter>("all");

  // keep a tiny per-driver "sending" state so one send doesn't disable all
  const [sendingForId, setSendingForId] = useState<number | null>(null);

  // keep a tiny per-driver "restoring" state so one restore doesn't disable all
  const [restoringForId, setRestoringForId] = useState<number | null>(null);

  // If Unassigned-only is on, "mine/others" would be empty/confusing. Reset to "all".
  useEffect(() => {
    if (driverFilter === "unassigned" && assignmentQuickFilter !== "all") {
      setAssignmentQuickFilter("all");
    }
  }, [driverFilter, assignmentQuickFilter]);

  /* ---------- Queries (LIMITED) ---------- */
  const driversQuery = trpc.admin.getDriverApplications.useQuery({
    limit: 200,
    view: driverView, // ✅ send view to backend
  });
  const corporateQuery = trpc.admin.getCorporateInquiries.useQuery({
    limit: 200,
  });
  const messagesQuery = trpc.admin.getContactMessages.useQuery({ limit: 200 });
  const teamMembersQuery = trpc.admin.getTeamMembers.useQuery();

  const rawDrivers = normalizeArray<any>(driversQuery.data);

  // ✅ Apply filters + quick filters + sort unassigned-to-top (all client-side)
  const drivers = useMemo(() => {
    const filtered = rawDrivers
      // Existing "Unassigned only" filter
      .filter((d: any) => {
        if (driverFilter === "unassigned") return !d?.assignedTo;
        return true;
      })
      // NEW quick filters
      .filter((d: any) => {
        const assignedTo = typeof d?.assignedTo === "string" ? d.assignedTo : "";
        const assignedTrim = assignedTo.trim();

        if (assignmentQuickFilter === "mine") {
          // If we don't know my name, show none rather than accidentally showing all
          return !!myName && assignedTrim === myName;
        }

        if (assignmentQuickFilter === "others") {
          // If myName unknown, this becomes "any assigned"
          if (!assignedTrim) return false;
          if (!myName) return true;
          return assignedTrim !== myName;
        }

        return true;
      });

    // NEW: sort unassigned first (and then newest first within group)
    return sortUnassignedFirst(
      filtered,
      (d: any) => d?.assignedTo,
      (d: any) => new Date(d?.createdAt ?? 0).getTime()
    );
  }, [rawDrivers, driverFilter, assignmentQuickFilter, myName]);

  const corporate = normalizeArray<any>(corporateQuery.data);
  const messages = normalizeArray<any>(messagesQuery.data);
  const teamMembersData = normalizeArray<any>(teamMembersQuery.data);

  const teamMembers = useMemo(() => {
    const names =
      teamMembersData.length > 0
        ? teamMembersData
            .map((m: any) => m?.name)
            .filter(Boolean)
            .map(String)
        : [];
    return Array.from(new Set(names));
  }, [teamMembersData]);

  /* ---------- Mutations ---------- */
  const updateDriverStatus = trpc.admin.updateDriverStatus.useMutation();
  const updateDriverNotes = trpc.admin.updateDriverNotes.useMutation();
  const updateDriverAssignment = trpc.admin.updateDriverAssignment.useMutation();

  const updateCorporateStatus = trpc.admin.updateCorporateStatus.useMutation();
  const updateCorporateNotes = trpc.admin.updateCorporateNotes.useMutation();
  const updateCorporateAssignment =
    trpc.admin.updateCorporateAssignment.useMutation();

  const markContactRead = trpc.admin.markContactRead.useMutation();
  const updateContactNotes = trpc.admin.updateContactNotes.useMutation();
  const updateContactAssignment =
    trpc.admin.updateContactAssignment.useMutation();

  // ✅ Phase 1 onboarding (admin)
  const sendOnboardingLink = trpc.admin.sendDriverOnboardingLink.useMutation();

  const handleExport = () => {
    if (activeTab === "drivers") exportToCSV(drivers, "driver-applications");
    else if (activeTab === "corporate")
      exportToCSV(corporate, "corporate-inquiries");
    else exportToCSV(messages, "contact-messages");
  };

  async function restoreDriverToActive(driverId: number) {
    try {
      setRestoringForId(driverId);

      // 1) restore status -> pending
      await updateDriverStatus.mutateAsync({
        id: driverId,
        status: "pending" as any,
      });

      // 2) unassign (recommended so it goes back into the pool)
      await updateDriverAssignment.mutateAsync({
        id: driverId,
        assignedTo: null,
      });

      await driversQuery.refetch();
      alert("Restored to Active ✅");
    } catch (err: any) {
      alert(err?.message || "Failed to restore driver");
    } finally {
      setRestoringForId(null);
    }
  }

  return (
    <AdminLayout title="Inquiries" description="Manage all inbound requests">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Inquiries</h1>

            {/* ✅ Drivers controls (only meaningful on Drivers tab) */}
            {activeTab === "drivers" && (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Active / Archived toggle */}
                <Select
                  value={driverView}
                  onValueChange={(v) =>
                    setDriverView(v as "active" | "archived")
                  }
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active drivers</SelectItem>
                    <SelectItem value="archived">
                      Archived (rejected)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* ✅ Assignment filter */}
                <Select
                  value={driverFilter}
                  onValueChange={(v) => setDriverFilter(v as any)}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unassigned">Unassigned only</SelectItem>
                  </SelectContent>
                </Select>

                {/* ✅ NEW: quick filters */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={assignmentQuickFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAssignmentQuickFilter("all")}
                  >
                    All
                  </Button>

                  <Button
                    type="button"
                    variant={assignmentQuickFilter === "mine" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAssignmentQuickFilter("mine")}
                    disabled={!myName || driverFilter === "unassigned"}
                    title={
                      !myName
                        ? "Can't detect your admin name for 'Assigned to me'"
                        : driverFilter === "unassigned"
                        ? "Unassigned-only is enabled"
                        : "Show items assigned to you"
                    }
                  >
                    Assigned to me
                  </Button>

                  <Button
                    type="button"
                    variant={
                      assignmentQuickFilter === "others" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setAssignmentQuickFilter("others")}
                    disabled={driverFilter === "unassigned"}
                    title={
                      driverFilter === "unassigned"
                        ? "Unassigned-only is enabled"
                        : "Show items assigned to others"
                    }
                  >
                    Assigned to others
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Errors */}
        <div className="space-y-2">
          <ErrorCard
            title="Drivers error"
            message={(driversQuery.error as any)?.message}
          />
          <ErrorCard
            title="Corporate error"
            message={(corporateQuery.error as any)?.message}
          />
          <ErrorCard
            title="Messages error"
            message={(messagesQuery.error as any)?.message}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
            <TabsTrigger value="corporate">
              Corporate ({corporate.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({messages.length})
            </TabsTrigger>
          </TabsList>

          {/* ---------------- DRIVERS ---------------- */}
          <TabsContent value="drivers" className="space-y-4">
            {driversQuery.isLoading && (
              <LoadingCard text="Loading driver applications..." />
            )}

            {!driversQuery.isLoading &&
              drivers.map((driver: any) => {
                const urgency = getUrgency(driver.createdAt);
                const urgencyColor = getUrgencyColor(urgency);

                const driverId = Number(driver.id);
                const isSendingThis = sendingForId === driverId;
                const isRestoringThis = restoringForId === driverId;

                // ✅ completion badge: supports either driver.documents or driver.driverDocuments
                const docs = (driver?.documents ??
                  driver?.driverDocuments ??
                  []) as any[];

                const completion = getDriverCompletionBadge(docs);

                const assignedLabel =
                  driver?.assignedTo && String(driver.assignedTo).trim()
                    ? `Assigned: ${String(driver.assignedTo).trim()}`
                    : "Unassigned";

                return (
                  <Card key={driver.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            {driver.fullName}
                          </h3>

                          {/* ✅ Assigned badge */}
                          <Badge variant="outline" title={assignedLabel}>
                            {assignedLabel}
                          </Badge>

                          {/* Time badge */}
                          <Badge className={urgencyColor}>
                            <Clock className="h-3 w-3 mr-1" />
                            {timeAgo(driver.createdAt)}
                          </Badge>

                          {/* ✅ Completion badge */}
                          <Badge
                            variant={completion.variant}
                            title={completion.detail}
                          >
                            {completion.text}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {driver.email} · {driver.phone}
                        </div>
                      </div>

                      <Select
                        value={driver.status}
                        onValueChange={(status) =>
                          updateDriverStatus.mutate(
                            { id: driver.id, status: status as any },
                            { onSuccess: () => driversQuery.refetch() }
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assignment */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={driver.assignedTo || "unassigned"}
                        onValueChange={(value) =>
                          updateDriverAssignment.mutate(
                            {
                              id: driver.id,
                              assignedTo: value === "unassigned" ? null : value,
                            },
                            { onSuccess: () => driversQuery.refetch() }
                          )
                        }
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <Textarea
                      defaultValue={driver.internalNotes || ""}
                      placeholder="Internal notes..."
                      onBlur={(e) => {
                        const next = e.target.value ?? "";
                        const prev = driver.internalNotes ?? "";
                        if (next === prev) return;

                        updateDriverNotes.mutate(
                          { id: driver.id, notes: next },
                          { onSuccess: () => driversQuery.refetch() }
                        );
                      }}
                    />

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${driver.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${driver.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        disabled={sendOnboardingLink.isPending && isSendingThis}
                        onClick={() => {
                          setSendingForId(driverId);

                          sendOnboardingLink.mutate(
                            { driverApplicationId: driverId },
                            {
                              onSuccess: async (res: any) => {
                                const link = res?.link;

                                if (link && typeof navigator !== "undefined") {
                                  try {
                                    await navigator.clipboard.writeText(link);
                                    alert(
                                      "Onboarding link sent + copied to clipboard ✅"
                                    );
                                  } catch {
                                    alert(`Onboarding link sent ✅\n\n${link}`);
                                  }
                                } else {
                                  alert("Onboarding link sent ✅");
                                }
                              },
                              onError: (err: any) => {
                                alert(
                                  err?.message || "Failed to send onboarding link"
                                );
                              },
                              onSettled: () => setSendingForId(null),
                            }
                          );
                        }}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {isSendingThis ? "Sending..." : "Send Onboarding Link"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAdminReview(Number(driver.id))}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review Uploads
                      </Button>

                      {/* ✅ Restore button (ONLY in Archived view) */}
                      {driverView === "archived" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isRestoringThis}
                          onClick={() => restoreDriverToActive(driverId)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {isRestoringThis ? "Restoring..." : "Restore to Active"}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}

            {!driversQuery.isLoading && drivers.length === 0 && (
              <LoadingCard
                text={
                  driverView === "archived"
                    ? "No archived (rejected) driver applications."
                    : driverFilter === "unassigned"
                    ? "No unassigned driver applications 🎉"
                    : assignmentQuickFilter === "mine"
                    ? "No driver applications assigned to you."
                    : assignmentQuickFilter === "others"
                    ? "No driver applications assigned to others."
                    : "No driver applications yet."
                }
              />
            )}
          </TabsContent>

          {/* ---------------- CORPORATE ---------------- */}
          <TabsContent value="corporate" className="space-y-4">
            {corporateQuery.isLoading && (
              <LoadingCard text="Loading corporate inquiries..." />
            )}

            {!corporateQuery.isLoading &&
              corporate.map((inquiry: any) => {
                const urgency = getUrgency(inquiry.createdAt);
                const urgencyColor = getUrgencyColor(urgency);

                return (
                  <Card key={inquiry.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {inquiry.companyName}
                          </h3>
                          <Badge className={urgencyColor}>
                            <Clock className="h-3 w-3 mr-1" />
                            {timeAgo(inquiry.createdAt)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {inquiry.contactName} · {inquiry.email} ·{" "}
                          {inquiry.phone}
                        </div>
                      </div>

                      <Select
                        value={inquiry.status}
                        onValueChange={(status) =>
                          updateCorporateStatus.mutate(
                            { id: inquiry.id, status: status as any },
                            { onSuccess: () => corporateQuery.refetch() }
                          )
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assignment */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={inquiry.assignedTo || "unassigned"}
                        onValueChange={(value) =>
                          updateCorporateAssignment.mutate(
                            {
                              id: inquiry.id,
                              assignedTo: value === "unassigned" ? null : value,
                            },
                            { onSuccess: () => corporateQuery.refetch() }
                          )
                        }
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <Textarea
                      defaultValue={inquiry.internalNotes || ""}
                      placeholder="Internal notes..."
                      onBlur={(e) => {
                        const next = e.target.value ?? "";
                        const prev = inquiry.internalNotes ?? "";
                        if (next === prev) return;

                        updateCorporateNotes.mutate(
                          { id: inquiry.id, notes: next },
                          { onSuccess: () => corporateQuery.refetch() }
                        );
                      }}
                    />
                  </Card>
                );
              })}

            {!corporateQuery.isLoading && corporate.length === 0 && (
              <LoadingCard text="No corporate inquiries yet." />
            )}
          </TabsContent>

          {/* ---------------- MESSAGES ---------------- */}
          <TabsContent value="messages" className="space-y-4">
            {messagesQuery.isLoading && (
              <LoadingCard text="Loading messages..." />
            )}

            {!messagesQuery.isLoading &&
              messages.map((msg: any) => {
                const urgency = getUrgency(msg.createdAt);
                const urgencyColor = getUrgencyColor(urgency);

                return (
                  <Card key={msg.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{msg.subject}</div>
                          {!msg.isRead && (
                            <Badge variant="destructive">Unread</Badge>
                          )}
                          <Badge className={urgencyColor}>
                            <Clock className="h-3 w-3 mr-1" />
                            {timeAgo(msg.createdAt)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {msg.name} · {msg.email}{" "}
                          {msg.phone ? `· ${msg.phone}` : ""}
                        </div>
                      </div>

                      {!msg.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            markContactRead.mutate(
                              { id: msg.id },
                              { onSuccess: () => messagesQuery.refetch() }
                            )
                          }
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>

                    <div className="text-sm bg-muted p-3 rounded-md">
                      {msg.message}
                    </div>

                    {/* Assignment */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={msg.assignedTo || "unassigned"}
                        onValueChange={(value) =>
                          updateContactAssignment.mutate(
                            {
                              id: msg.id,
                              assignedTo: value === "unassigned" ? null : value,
                            },
                            { onSuccess: () => messagesQuery.refetch() }
                          )
                        }
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <Textarea
                      defaultValue={msg.internalNotes || ""}
                      placeholder="Internal notes..."
                      onBlur={(e) => {
                        const next = e.target.value ?? "";
                        const prev = msg.internalNotes ?? "";
                        if (next === prev) return;

                        updateContactNotes.mutate(
                          { id: msg.id, notes: next },
                          { onSuccess: () => messagesQuery.refetch() }
                        );
                      }}
                    />

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${msg.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>
                      {msg.phone && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${msg.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}

            {!messagesQuery.isLoading && messages.length === 0 && (
              <LoadingCard text="No messages yet." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
