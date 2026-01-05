import { useMemo, useState } from "react";
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
} from "lucide-react";
import { timeAgo, getUrgency, getUrgencyColor } from "@/lib/timeUtils";

// ✅ Completion badge helper
import { getDriverCompletionBadge } from "@/lib/driverCompletion";

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
  useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/login" });

  const [activeTab, setActiveTab] = useState("drivers");

  // keep a tiny per-driver "sending" state so one send doesn't disable all
  const [sendingForId, setSendingForId] = useState<number | null>(null);

  /* ---------- Queries (LIMITED) ---------- */
  const driversQuery = trpc.admin.getDriverApplications.useQuery({ limit: 200 });
  const corporateQuery = trpc.admin.getCorporateInquiries.useQuery({
    limit: 200,
  });
  const messagesQuery = trpc.admin.getContactMessages.useQuery({ limit: 200 });
  const teamMembersQuery = trpc.admin.getTeamMembers.useQuery();

  const drivers = normalizeArray<any>(driversQuery.data);
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

  return (
    <AdminLayout title="Inquiries" description="Manage all inbound requests">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Inquiries</h1>
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

                // ✅ completion badge: supports either driver.documents or driver.driverDocuments
                const docs = (driver?.documents ??
                  driver?.driverDocuments ??
                  []) as any[];

                const completion = getDriverCompletionBadge(docs);

                return (
                  <Card key={driver.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {driver.fullName}
                          </h3>

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

                                // NOTE:
                                // After the backend change, failures will come through onError(),
                                // so we can safely treat onSuccess as "sent".

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
                                  err?.message ||
                                    "Failed to send onboarding link"
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
                    </div>
                  </Card>
                );
              })}

            {!driversQuery.isLoading && drivers.length === 0 && (
              <LoadingCard text="No driver applications yet." />
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
