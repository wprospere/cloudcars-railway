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
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";

import { timeAgo, getUrgency, getUrgencyColor } from "@/lib/timeUtils";
import { getDriverCompletionBadge } from "@/lib/driverCompletion";

/* ---------------- Helpers ---------------- */
type MaybeString = string | null | undefined;

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

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <Badge variant="outline" className="text-muted-foreground">
        {count}
      </Badge>
    </div>
  );
}

function openAdminReview(driverApplicationId: number) {
  window.location.href = `/admin/driver-onboarding/${driverApplicationId}`;
}

/* ---------------- SLA / Priority ---------------- */
type SLALevel = "OVERDUE" | "CRITICAL" | "HIGH" | "NORMAL";

function getSlaLevel(createdAt: any): {
  level: SLALevel;
  rank: number;
  label: string;
} {
  const ms = new Date(createdAt ?? 0).getTime();
  const ageHours = (Date.now() - ms) / (1000 * 60 * 60);

  if (ageHours >= 72) return { level: "OVERDUE", rank: 0, label: "Overdue" };
  if (ageHours >= 24) return { level: "CRITICAL", rank: 1, label: "Critical" };
  if (ageHours >= 8) return { level: "HIGH", rank: 2, label: "High" };
  return { level: "NORMAL", rank: 3, label: "Normal" };
}

function slaBadgeClass(level: SLALevel) {
  switch (level) {
    case "OVERDUE":
      return "bg-red-600/20 text-red-300 border border-red-500/40";
    case "CRITICAL":
      return "bg-orange-600/20 text-orange-300 border border-orange-500/40";
    case "HIGH":
      return "bg-yellow-600/20 text-yellow-200 border border-yellow-500/40";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

/* ---------------- Sorting ---------------- */
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

      if (aAssigned !== bAssigned) return aAssigned ? 1 : -1;

      if (getCreatedAt) {
        const at = getCreatedAt(a.row);
        const bt = getCreatedAt(b.row);
        if (at !== bt) return bt - at;
      }

      return a.idx - b.idx;
    })
    .map((x) => x.row);
}

function sortBySlaThenNewest<T>(rows: T[], getCreatedAt: (row: T) => number) {
  return rows
    .map((row, idx) => ({ row, idx }))
    .sort((a, b) => {
      const at = getCreatedAt(a.row);
      const bt = getCreatedAt(b.row);

      const aSla = getSlaLevel(at).rank;
      const bSla = getSlaLevel(bt).rank;
      if (aSla !== bSla) return aSla - bSla;

      if (at !== bt) return bt - at;
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

/* ---------------- Page ---------------- */
export default function Inquiries() {
  useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/admin/login",
  });

  // ✅ Force your name for one-click assignment + "Assigned to me"
  const myName = "Wayne";

  const [activeTab, setActiveTab] = useState<"drivers" | "corporate" | "messages">(
    "drivers"
  );

  const [driverView, setDriverView] = useState<"active" | "archived">("active");
  const [driverFilter, setDriverFilter] = useState<"all" | "unassigned">("all");

  type AssignedQuick = "all" | "unassigned" | "mine" | "others" | "person";
  const [assignedQuick, setAssignedQuick] = useState<AssignedQuick>("all");
  const [assignedPerson, setAssignedPerson] = useState<string>("");

  const [sendingForId, setSendingForId] = useState<number | null>(null);
  const [restoringForId, setRestoringForId] = useState<number | null>(null);

  // ✅ One-click assignment loading (so you don't spam-click)
  const [assigningKey, setAssigningKey] = useState<string | null>(null);

  useEffect(() => {
    if (driverFilter === "unassigned" && assignedQuick !== "all") {
      setAssignedQuick("all");
      setAssignedPerson("");
    }
  }, [driverFilter, assignedQuick]);

  /* ---------- Queries ---------- */
  const driversQuery = trpc.admin.getDriverApplications.useQuery({
    limit: 200,
    view: driverView,
  });
  const corporateQuery = trpc.admin.getCorporateInquiries.useQuery({
    limit: 200,
  });
  const messagesQuery = trpc.admin.getContactMessages.useQuery({ limit: 200 });
  const teamMembersQuery = trpc.admin.getTeamMembers.useQuery();

  const rawDrivers = normalizeArray<any>(driversQuery.data);
  const corporate = normalizeArray<any>(corporateQuery.data);
  const messages = normalizeArray<any>(messagesQuery.data);
  const teamMembersData = normalizeArray<any>(teamMembersQuery.data);

  // ✅ Always include Wayne in the dropdown even if backend list is empty
  const teamMembers = useMemo(() => {
    const names =
      teamMembersData.length > 0
        ? teamMembersData
            .map((m: any) => m?.name)
            .filter(Boolean)
            .map(String)
        : [];

    names.push("Wayne");

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [teamMembersData]);

  const drivers = useMemo(() => {
    const filtered = rawDrivers
      .filter((d: any) => {
        if (driverFilter === "unassigned") return !d?.assignedTo;
        return true;
      })
      .filter((d: any) => {
        const assignedTo =
          typeof d?.assignedTo === "string" ? d.assignedTo : "";
        const assignedTrim = assignedTo.trim();

        if (assignedQuick === "all") return true;
        if (assignedQuick === "unassigned") return !assignedTrim;

        if (assignedQuick === "mine") return assignedTrim === myName;

        if (assignedQuick === "others") {
          if (!assignedTrim) return false;
          return assignedTrim !== myName;
        }

        if (assignedQuick === "person") {
          return !!assignedPerson && assignedTrim === assignedPerson;
        }

        return true;
      });

    return sortUnassignedFirst(
      filtered,
      (d: any) => d?.assignedTo,
      (d: any) => new Date(d?.createdAt ?? 0).getTime()
    );
  }, [rawDrivers, driverFilter, assignedQuick, assignedPerson, myName]);

  const driverSections = useMemo(() => {
    const unassigned: any[] = [];
    const mine: any[] = [];
    const others: any[] = [];

    for (const d of drivers) {
      const assignedName =
        d?.assignedTo && String(d.assignedTo).trim()
          ? String(d.assignedTo).trim()
          : null;

      if (!assignedName) unassigned.push(d);
      else if (assignedName === myName) mine.push(d);
      else others.push(d);
    }

    const getCreated = (x: any) => new Date(x?.createdAt ?? 0).getTime();

    return {
      unassigned: sortBySlaThenNewest(unassigned, getCreated),
      mine: sortBySlaThenNewest(mine, getCreated),
      others: sortBySlaThenNewest(others, getCreated),
    };
  }, [drivers, myName]);

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

      await updateDriverStatus.mutateAsync({
        id: driverId,
        status: "pending" as any,
      });

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

  // ✅ One-click assignment helpers
  async function assignDriver(id: number, assignedTo: string | null) {
    const key = `driver:${id}:${assignedTo ?? "unassigned"}`;
    try {
      setAssigningKey(key);
      await updateDriverAssignment.mutateAsync({ id, assignedTo });
      await driversQuery.refetch();
    } catch (e: any) {
      alert(e?.message || "Failed to assign");
    } finally {
      setAssigningKey(null);
    }
  }

  async function assignCorporate(id: number, assignedTo: string | null) {
    const key = `corp:${id}:${assignedTo ?? "unassigned"}`;
    try {
      setAssigningKey(key);
      await updateCorporateAssignment.mutateAsync({ id, assignedTo });
      await corporateQuery.refetch();
    } catch (e: any) {
      alert(e?.message || "Failed to assign");
    } finally {
      setAssigningKey(null);
    }
  }

  async function assignMessage(id: number, assignedTo: string | null) {
    const key = `msg:${id}:${assignedTo ?? "unassigned"}`;
    try {
      setAssigningKey(key);
      await updateContactAssignment.mutateAsync({ id, assignedTo });
      await messagesQuery.refetch();
    } catch (e: any) {
      alert(e?.message || "Failed to assign");
    } finally {
      setAssigningKey(null);
    }
  }

  function DriverCard({ driver }: { driver: any }) {
    const urgency = getUrgency(driver.createdAt);
    const urgencyColor = getUrgencyColor(urgency);

    const driverId = Number(driver.id);
    const isSendingThis = sendingForId === driverId;
    const isRestoringThis = restoringForId === driverId;

    const docs = (driver?.documents ?? driver?.driverDocuments ?? []) as any[];
    const completion = getDriverCompletionBadge(docs);

    const assignedName =
      driver?.assignedTo && String(driver.assignedTo).trim()
        ? String(driver.assignedTo).trim()
        : null;

    const isMine = !!assignedName && assignedName === myName;

    const createdMs = new Date(driver?.createdAt ?? 0).getTime();
    const sla = getSlaLevel(createdMs);

    const isAssignWayneLoading = assigningKey === `driver:${driverId}:Wayne`;
    const isUnassignLoading = assigningKey === `driver:${driverId}:unassigned`;

    return (
      <Card key={driver.id} className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">{driver.fullName}</h3>

              <Badge className={slaBadgeClass(sla.level)} title="SLA by age">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {sla.label}
              </Badge>

              {assignedName ? (
                <Badge
                  className={
                    isMine
                      ? "bg-green-600/20 text-green-300 border border-green-500/40"
                      : "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                  }
                  title={isMine ? "Assigned to you" : `Assigned to ${assignedName}`}
                >
                  <User className="h-3 w-3 mr-1" />
                  {assignedName}
                  {isMine && " (you)"}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground"
                  title="Not assigned yet"
                >
                  <User className="h-3 w-3 mr-1" />
                  Unassigned
                </Badge>
              )}

              <Badge className={urgencyColor}>
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo(driver.createdAt)}
              </Badge>

              <Badge variant={completion.variant} title={completion.detail}>
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

        <div className="flex items-center gap-2 flex-wrap">
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
            <SelectTrigger className="w-[260px]">
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

          {/* ✅ One-click actions */}
          <Button
            type="button"
            variant={isMine ? "outline" : "secondary"}
            size="sm"
            disabled={isAssignWayneLoading}
            onClick={() => assignDriver(driverId, "Wayne")}
            title="Assign this to Wayne"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            {isAssignWayneLoading ? "Assigning..." : "Assign to Wayne"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!assignedName || isUnassignLoading}
            onClick={() => assignDriver(driverId, null)}
            title="Unassign"
          >
            <UserX className="h-4 w-4 mr-2" />
            {isUnassignLoading ? "Unassigning..." : "Unassign"}
          </Button>
        </div>

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
                        alert("Onboarding link sent + copied ✅");
                      } catch {
                        alert(`Onboarding link sent ✅\n\n${link}`);
                      }
                    } else {
                      alert("Onboarding link sent ✅");
                    }
                  },
                  onError: (err: any) => {
                    alert(err?.message || "Failed to send onboarding link");
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
  }

  return (
    <AdminLayout title="Inquiries" description="Manage all inbound requests">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Inquiries</h1>

            {activeTab === "drivers" && (
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={driverView}
                  onValueChange={(v) => setDriverView(v as "active" | "archived")}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active drivers</SelectItem>
                    <SelectItem value="archived">Archived (rejected)</SelectItem>
                  </SelectContent>
                </Select>

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

                <Select
                  value={
                    assignedQuick === "person"
                      ? `person:${assignedPerson || ""}`
                      : assignedQuick
                  }
                  onValueChange={(v) => {
                    if (v.startsWith("person:")) {
                      const name = v.replace("person:", "");
                      setAssignedQuick("person");
                      setAssignedPerson(name);
                      return;
                    }
                    setAssignedQuick(v as any);
                    setAssignedPerson("");
                  }}
                >
                  <SelectTrigger className="w-[260px]">
                    <SelectValue placeholder="Assigned filter..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All assignments</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="mine">Assigned to Wayne</SelectItem>
                    <SelectItem value="others">Assigned to others</SelectItem>
                    {teamMembers.map((name) => (
                      <SelectItem key={name} value={`person:${name}`}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
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

            {!driversQuery.isLoading && (
              <div className="space-y-6">
                {driverFilter === "unassigned" ? (
                  <div className="space-y-4">
                    <SectionHeader
                      title="Unassigned"
                      count={driverSections.unassigned.length}
                    />
                    {driverSections.unassigned.map((d) => (
                      <DriverCard key={d.id} driver={d} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <SectionHeader
                        title="Unassigned"
                        count={driverSections.unassigned.length}
                      />
                      {driverSections.unassigned.map((d) => (
                        <DriverCard key={d.id} driver={d} />
                      ))}
                    </div>

                    <div className="space-y-4">
                      <SectionHeader
                        title="Assigned to Wayne"
                        count={driverSections.mine.length}
                      />
                      {driverSections.mine.map((d) => (
                        <DriverCard key={d.id} driver={d} />
                      ))}
                    </div>

                    <div className="space-y-4">
                      <SectionHeader
                        title="Assigned to others"
                        count={driverSections.others.length}
                      />
                      {driverSections.others.map((d) => (
                        <DriverCard key={d.id} driver={d} />
                      ))}
                    </div>
                  </>
                )}

                {drivers.length === 0 && (
                  <LoadingCard
                    text={
                      driverView === "archived"
                        ? "No archived (rejected) driver applications."
                        : driverFilter === "unassigned"
                        ? "No unassigned driver applications 🎉"
                        : assignedQuick === "mine"
                        ? "No driver applications assigned to Wayne."
                        : assignedQuick === "others"
                        ? "No driver applications assigned to others."
                        : assignedQuick === "unassigned"
                        ? "No unassigned driver applications 🎉"
                        : assignedQuick === "person"
                        ? `No driver applications assigned to ${
                            assignedPerson || "that person"
                          }.`
                        : "No driver applications yet."
                    }
                  />
                )}
              </div>
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

                const assignedName =
                  inquiry?.assignedTo && String(inquiry.assignedTo).trim()
                    ? String(inquiry.assignedTo).trim()
                    : null;

                const isMine = !!assignedName && assignedName === myName;

                const sla = getSlaLevel(inquiry?.createdAt);

                const corpKeyAssign = `corp:${Number(inquiry.id)}:Wayne`;
                const corpKeyUnassign = `corp:${Number(inquiry.id)}:unassigned`;

                return (
                  <Card key={inquiry.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            {inquiry.companyName}
                          </h3>

                          <Badge
                            className={slaBadgeClass(sla.level)}
                            title="SLA by age"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {sla.label}
                          </Badge>

                          {assignedName ? (
                            <Badge
                              className={
                                isMine
                                  ? "bg-green-600/20 text-green-300 border border-green-500/40"
                                  : "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                              }
                              title={
                                isMine
                                  ? "Assigned to Wayne"
                                  : `Assigned to ${assignedName}`
                              }
                            >
                              <User className="h-3 w-3 mr-1" />
                              {assignedName}
                              {isMine && " (Wayne)"}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                              title="Not assigned yet"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Unassigned
                            </Badge>
                          )}

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

                    <div className="flex items-center gap-2 flex-wrap">
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
                        <SelectTrigger className="w-[260px]">
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

                      <Button
                        type="button"
                        variant={isMine ? "outline" : "secondary"}
                        size="sm"
                        disabled={assigningKey === corpKeyAssign}
                        onClick={() =>
                          assignCorporate(Number(inquiry.id), "Wayne")
                        }
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        {assigningKey === corpKeyAssign
                          ? "Assigning..."
                          : "Assign to Wayne"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!assignedName || assigningKey === corpKeyUnassign}
                        onClick={() => assignCorporate(Number(inquiry.id), null)}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        {assigningKey === corpKeyUnassign
                          ? "Unassigning..."
                          : "Unassign"}
                      </Button>
                    </div>

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

                const assignedName =
                  msg?.assignedTo && String(msg.assignedTo).trim()
                    ? String(msg.assignedTo).trim()
                    : null;

                const isMine = !!assignedName && assignedName === myName;

                const createdMs = new Date(msg?.createdAt ?? 0).getTime();
                const sla = getSlaLevel(createdMs);

                const msgKeyAssign = `msg:${Number(msg.id)}:Wayne`;
                const msgKeyUnassign = `msg:${Number(msg.id)}:unassigned`;

                return (
                  <Card key={msg.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-semibold">{msg.subject}</div>

                          <Badge
                            className={slaBadgeClass(sla.level)}
                            title="SLA by age"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {sla.label}
                          </Badge>

                          {assignedName ? (
                            <Badge
                              className={
                                isMine
                                  ? "bg-green-600/20 text-green-300 border border-green-500/40"
                                  : "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                              }
                              title={
                                isMine
                                  ? "Assigned to Wayne"
                                  : `Assigned to ${assignedName}`
                              }
                            >
                              <User className="h-3 w-3 mr-1" />
                              {assignedName}
                              {isMine && " (Wayne)"}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                              title="Not assigned yet"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Unassigned
                            </Badge>
                          )}

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

                    <div className="flex items-center gap-2 flex-wrap">
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
                        <SelectTrigger className="w-[260px]">
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

                      <Button
                        type="button"
                        variant={isMine ? "outline" : "secondary"}
                        size="sm"
                        disabled={assigningKey === msgKeyAssign}
                        onClick={() => assignMessage(Number(msg.id), "Wayne")}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        {assigningKey === msgKeyAssign
                          ? "Assigning..."
                          : "Assign to Wayne"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!assignedName || assigningKey === msgKeyUnassign}
                        onClick={() => assignMessage(Number(msg.id), null)}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        {assigningKey === msgKeyUnassign
                          ? "Unassigning..."
                          : "Unassign"}
                      </Button>
                    </div>

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
