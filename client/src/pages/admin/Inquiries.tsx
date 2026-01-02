import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Mail, Phone, Download, Clock, User } from "lucide-react";
import { timeAgo, getUrgency, getUrgencyColor } from "@/lib/timeUtils";

// Simple CSV export function
function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
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

/**
 * ✅ Normalize tRPC responses that might be:
 * - Array: [...]
 * - Object: { ok: true, items: [...] } / { data: [...] } / { rows: [...] } etc
 */
function normalizeArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    const candidates = [
      "items",
      "data",
      "rows",
      "results",
      "inquiries",
      "messages",
      "applications",
    ];

    for (const key of candidates) {
      const v = (value as any)[key];
      if (Array.isArray(v)) return v;
    }
  }

  return [];
}

function DataLoadErrorBanner({
  driversError,
  corporateError,
  messagesError,
}: {
  driversError?: { message?: string } | null;
  corporateError?: { message?: string } | null;
  messagesError?: { message?: string } | null;
}) {
  if (!driversError && !corporateError && !messagesError) return null;

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
      <div className="font-semibold mb-1">Data load error</div>
      <div>Drivers: {driversError?.message || "OK"}</div>
      <div>Corporate: {corporateError?.message || "OK"}</div>
      <div>Messages: {messagesError?.message || "OK"}</div>
    </div>
  );
}

export default function Inquiries() {
  // ✅ protect this page
  useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/login" });

  const [activeTab, setActiveTab] = useState("drivers");

  // -------------------------
  // Fetch all inquiries (tRPC)
  // -------------------------
  const driversQuery = trpc.admin.getDriverApplications.useQuery();
  const corporateQuery = trpc.admin.getCorporateInquiries.useQuery();
  const messagesQuery = trpc.admin.getContactMessages.useQuery();
  const teamMembersQuery = trpc.admin.getTeamMembers.useQuery();

  // ✅ TEMP DEBUG (remove later)
  if (driversQuery.error) console.error("driversQuery.error:", driversQuery.error);
  if (corporateQuery.error)
    console.error("corporateQuery.error:", corporateQuery.error);
  if (messagesQuery.error)
    console.error("messagesQuery.error:", messagesQuery.error);

  const drivers = normalizeArray<any>(driversQuery.data);
  const corporate = normalizeArray<any>(corporateQuery.data);
  const messages = normalizeArray<any>(messagesQuery.data);
  const teamMembersData = normalizeArray<any>(teamMembersQuery.data);

  const refetchDrivers = driversQuery.refetch;
  const refetchCorporate = corporateQuery.refetch;
  const refetchMessages = messagesQuery.refetch;

  // Mutations
  const updateDriverStatus = trpc.admin.updateDriverStatus.useMutation();
  const updateDriverNotes = trpc.admin.updateDriverNotes.useMutation();
  const updateDriverAssignment = trpc.admin.updateDriverAssignment.useMutation();

  const updateCorporateStatus = trpc.admin.updateCorporateStatus.useMutation();
  const updateCorporateNotes = trpc.admin.updateCorporateNotes.useMutation();
  const updateCorporateAssignment = trpc.admin.updateCorporateAssignment.useMutation();

  const markContactRead = trpc.admin.markContactRead.useMutation();
  const updateContactNotes = trpc.admin.updateContactNotes.useMutation();
  const updateContactAssignment = trpc.admin.updateContactAssignment.useMutation();

  // Team members for assignment - use dynamic data or fallback
  const teamMembers =
    teamMembersData.length > 0
      ? teamMembersData.map((m: any) => m.name)
      : ["John Smith", "Sarah Johnson", "Mike Williams"];

  const handleExport = () => {
    if (activeTab === "drivers") exportToCSV(drivers, "driver-applications");
    else if (activeTab === "corporate") exportToCSV(corporate, "corporate-inquiries");
    else exportToCSV(messages, "contact-messages");

    alert("Exported successfully!");
  };

  // Stats
  const pendingDrivers = drivers.filter((d) => d.status === "pending").length;
  const pendingCorporate = corporate.filter((c) => c.status === "pending").length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <AdminLayout
      title="Inquiries"
      description="Manage driver applications, corporate leads, and messages"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inquiries</h1>
            <p className="text-muted-foreground">
              Manage driver applications, corporate leads, and messages
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        {/* ✅ Debug banner (safe + inside component) */}
        <DataLoadErrorBanner
          driversError={driversQuery.error as any}
          corporateError={corporateQuery.error as any}
          messagesError={messagesQuery.error as any}
        />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Drivers</div>
            <div className="text-2xl font-bold">{pendingDrivers}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Pending Corporate</div>
            <div className="text-2xl font-bold">{pendingCorporate}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Unread Messages</div>
            <div className="text-2xl font-bold">{unreadMessages}</div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="drivers">
              Driver Applications ({drivers.length})
            </TabsTrigger>
            <TabsTrigger value="corporate">
              Corporate Inquiries ({corporate.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Contact Messages ({messages.length})
            </TabsTrigger>
          </TabsList>

          {/* Driver Applications */}
          <TabsContent value="drivers" className="space-y-4">
            {drivers.map((driver) => {
              const urgency = getUrgency(driver.createdAt);
              const urgencyColor = getUrgencyColor(urgency);

              return (
                <Card key={driver.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{driver.fullName}</h3>
                          <Badge className={urgencyColor}>
                            <Clock className="h-3 w-3 mr-1" />
                            {timeAgo(driver.createdAt)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {driver.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {driver.phone}
                          </span>
                        </div>
                      </div>

                      <Select
                        value={driver.status}
                        onValueChange={(value) => {
                          updateDriverStatus.mutate(
                            { id: driver.id, status: value as any },
                            { onSuccess: () => refetchDrivers() }
                          );
                        }}
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

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Licence:</span>{" "}
                        {driver.licenseNumber}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Experience:</span>{" "}
                        {driver.yearsExperience} years
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vehicle Owner:</span>{" "}
                        {driver.vehicleOwner ? "Yes" : "No"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Availability:</span>{" "}
                        {driver.availability}
                      </div>
                    </div>

                    {driver.message && (
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <strong>Message:</strong> {driver.message}
                      </div>
                    )}

                    {/* Assignment */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={driver.assignedTo || "unassigned"}
                        onValueChange={(value) => {
                          updateDriverAssignment.mutate(
                            {
                              id: driver.id,
                              assignedTo: value === "unassigned" ? null : value,
                            },
                            { onSuccess: () => refetchDrivers() }
                          );
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Internal Notes (Private)
                      </Label>
                      <Textarea
                        placeholder="Add notes about this application..."
                        defaultValue={driver.internalNotes || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (driver.internalNotes || "")) {
                            updateDriverNotes.mutate(
                              { id: driver.id, notes: e.target.value },
                              { onSuccess: () => refetchDrivers() }
                            );
                          }
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
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
                    </div>
                  </div>
                </Card>
              );
            })}

            {drivers.length === 0 && (
              <Card className="p-12 text-center text-muted-foreground">
                No driver applications yet
              </Card>
            )}
          </TabsContent>

          {/* Corporate Inquiries */}
          <TabsContent value="corporate" className="space-y-4">
            {corporate.map((inquiry) => {
              const urgency = getUrgency(inquiry.createdAt);
              const urgencyColor = getUrgencyColor(urgency);

              return (
                <Card key={inquiry.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{inquiry.companyName}</h3>
                          <Badge className={urgencyColor}>
                            <Clock className="h-3 w-3 mr-1" />
                            {timeAgo(inquiry.createdAt)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Contact: {inquiry.contactName}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {inquiry.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {inquiry.phone}
                          </span>
                        </div>
                      </div>

                      <Select
                        value={inquiry.status}
                        onValueChange={(value) => {
                          updateCorporateStatus.mutate(
                            { id: inquiry.id, status: value as any },
                            { onSuccess: () => refetchCorporate() }
                          );
                        }}
                      >
                        <SelectTrigger className="w-[140px]">
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

                    {inquiry.estimatedMonthlyTrips && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Estimated Monthly Trips:
                        </span>{" "}
                        {inquiry.estimatedMonthlyTrips}
                      </div>
                    )}

                    {inquiry.requirements && (
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <strong>Requirements:</strong> {inquiry.requirements}
                      </div>
                    )}

                    {/* Assignment */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={inquiry.assignedTo || "unassigned"}
                        onValueChange={(value) => {
                          updateCorporateAssignment.mutate(
                            {
                              id: inquiry.id,
                              assignedTo: value === "unassigned" ? null : value,
                            },
                            { onSuccess: () => refetchCorporate() }
                          );
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Internal Notes (Private)
                      </Label>
                      <Textarea
                        placeholder="Add notes about this inquiry..."
                        defaultValue={inquiry.internalNotes || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (inquiry.internalNotes || "")) {
                            updateCorporateNotes.mutate(
                              { id: inquiry.id, notes: e.target.value },
                              { onSuccess: () => refetchCorporate() }
                            );
                          }
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${inquiry.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${inquiry.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {corporate.length === 0 && (
              <Card className="p-12 text-center text-muted-foreground">
                No corporate inquiries yet
              </Card>
            )}
          </TabsContent>

          {/* Contact Messages */}
          <TabsContent value="messages" className="space-y-4">
            {messages.map((message) => {
              const urgency = getUrgency(message.createdAt);
              const urgencyColor = getUrgencyColor(urgency);

              return (
                <Card key={message.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{message.name}</h3>
                          {!message.isRead && <Badge variant="destructive">Unread</Badge>}
                          <Badge className={urgencyColor}>
                            <Clock className="h-3 w-3 mr-1" />
                            {timeAgo(message.createdAt)}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{message.subject}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {message.email}
                          </span>
                          {message.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {message.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {!message.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            markContactRead.mutate(
                              { id: message.id },
                              { onSuccess: () => refetchMessages() }
                            );
                          }}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>

                    <div className="bg-muted p-3 rounded-md text-sm">{message.message}</div>

                    {/* Assignment */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={message.assignedTo || "unassigned"}
                        onValueChange={(value) => {
                          updateContactAssignment.mutate(
                            {
                              id: message.id,
                              assignedTo: value === "unassigned" ? null : value,
                            },
                            { onSuccess: () => refetchMessages() }
                          );
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Internal Notes (Private)
                      </Label>
                      <Textarea
                        placeholder="Add notes about this message..."
                        defaultValue={message.internalNotes || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (message.internalNotes || "")) {
                            updateContactNotes.mutate(
                              { id: message.id, notes: e.target.value },
                              { onSuccess: () => refetchMessages() }
                            );
                          }
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${message.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>
                      {message.phone && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${message.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            {messages.length === 0 && (
              <Card className="p-12 text-center text-muted-foreground">
                No contact messages yet
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
