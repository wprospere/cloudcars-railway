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

/* ---------------- CSV Export ---------------- */
function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((((h) => JSON.stringify(row?.[h] ?? ""))).join(",")
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
      if (Array.isArray(value[key])) return value[key];
    }
  }
  return [];
}

function LoadingCard({ text }: { text: string }) {
  return (
    <Card className="p-6 text-center text-muted-foreground">
      {text}
    </Card>
  );
}

/* ---------------- Page ---------------- */
export default function Inquiries() {
  useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/login" });

  const [activeTab, setActiveTab] = useState("drivers");

  /* ---------- Queries (LIMITED) ---------- */
  const driversQuery = trpc.admin.getDriverApplications.useQuery({ limit: 200 });
  const corporateQuery = trpc.admin.getCorporateInquiries.useQuery({ limit: 200 });
  const messagesQuery = trpc.admin.getContactMessages.useQuery({ limit: 200 });
  const teamMembersQuery = trpc.admin.getTeamMembers.useQuery();

  const drivers = normalizeArray(driversQuery.data);
  const corporate = normalizeArray(corporateQuery.data);
  const messages = normalizeArray(messagesQuery.data);
  const teamMembersData = normalizeArray(teamMembersQuery.data);

  const teamMembers =
    teamMembersData.length > 0
      ? teamMembersData.map((m: any) => m.name)
      : ["Unassigned"];

  /* ---------- Mutations ---------- */
  const updateDriverStatus = trpc.admin.updateDriverStatus.useMutation();
  const updateDriverNotes = trpc.admin.updateDriverNotes.useMutation();
  const updateDriverAssignment = trpc.admin.updateDriverAssignment.useMutation();

  const updateCorporateStatus = trpc.admin.updateCorporateStatus.useMutation();
  const updateCorporateNotes = trpc.admin.updateCorporateNotes.useMutation();
  const updateCorporateAssignment = trpc.admin.updateCorporateAssignment.useMutation();

  const markContactRead = trpc.admin.markContactRead.useMutation();
  const updateContactNotes = trpc.admin.updateContactNotes.useMutation();
  const updateContactAssignment = trpc.admin.updateContactAssignment.useMutation();

  const sendOnboardingLink = trpc.admin.sendDriverOnboardingLink.useMutation();

  const handleExport = () => {
    if (activeTab === "drivers") exportToCSV(drivers, "driver-applications");
    else if (activeTab === "corporate") exportToCSV(corporate, "corporate-inquiries");
    else exportToCSV(messages, "contact-messages");
  };

  return (
    <AdminLayout title="Inquiries" description="Manage all inbound requests">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inquiries</h1>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="drivers">
              Drivers ({drivers.length})
            </TabsTrigger>
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

                return (
                  <Card key={driver.id} className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{driver.fullName}</h3>
                        <Badge className={urgencyColor}>
                          <Clock className="h-3 w-3 mr-1" />
                          {timeAgo(driver.createdAt)}
                        </Badge>
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

                    <div className="text-sm text-muted-foreground">
                      {driver.email} · {driver.phone}
                    </div>

                    <Textarea
                      defaultValue={driver.internalNotes || ""}
                      placeholder="Internal notes..."
                      onBlur={(e) =>
                        updateDriverNotes.mutate(
                          { id: driver.id, notes: e.target.value },
                          { onSuccess: () => driversQuery.refetch() }
                        )
                      }
                    />
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
              corporate.map((inquiry: any) => (
                <Card key={inquiry.id} className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">{inquiry.companyName}</h3>
                  <div className="text-sm text-muted-foreground">
                    {inquiry.contactName} · {inquiry.email}
                  </div>
                </Card>
              ))}

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
              messages.map((msg: any) => (
                <Card key={msg.id} className="p-6 space-y-2">
                  <div className="font-semibold">{msg.subject}</div>
                  <div className="text-sm">{msg.message}</div>
                </Card>
              ))}

            {!messagesQuery.isLoading && messages.length === 0 && (
              <LoadingCard text="No messages yet." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
