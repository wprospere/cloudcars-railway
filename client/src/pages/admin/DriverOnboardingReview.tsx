import { useMemo, useRef, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { AdminActivityTimeline } from "@/components/admin/AdminActivityTimeline";
import { toast } from "sonner";

type DocStatusUI = "approved" | "rejected" | "pending" | string;

function filenameFromUrl(url: string) {
  const clean = url.split("?")[0] || url;
  return clean.split("/").pop() || "document";
}

function isPdf(mimeType?: string | null, url?: string | null) {
  const mt = String(mimeType || "").toLowerCase();
  if (mt.includes("pdf")) return true;
  const u = String(url || "").toLowerCase();
  return u.endsWith(".pdf") || u.includes(".pdf?");
}

export default function DriverOnboardingReview() {
  const [, params] = useRoute("/admin/driver-onboarding/:id");
  const driverApplicationId = params?.id ? Number(params.id) : NaN;
  const enabled = Number.isFinite(driverApplicationId) && driverApplicationId > 0;

  // ---- Queries
  const profileQuery = trpc.admin.getDriverOnboardingProfile.useQuery(
    { driverApplicationId },
    { enabled }
  );

  const activityQuery = trpc.admin.getActivity.useQuery(
    {
      entityType: "driver_application",
      entityId: driverApplicationId,
      limit: 50,
    },
    { enabled }
  );

  // ---- Mutations
  const reviewDoc = trpc.admin.reviewDriverDocument.useMutation();
  const sendReminder = trpc.admin.sendDriverOnboardingReminder.useMutation();

  // ---- UI state
  const [rejectionReasons, setRejectionReasons] = useState<Record<number, string>>(
    {}
  );
  const [reminderMessage, setReminderMessage] = useState("");

  // (kept from your version; not used yet but harmless)
  const viewportRef = useRef<HTMLDivElement | null>(null);
  void viewportRef; // avoid unused warning if you aren't using it yet
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  void scale;
  void pan;
  void isDragging;
  void setScale;
  void setPan;
  void setIsDragging;
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  void dragStart;
  void panStart;

  const statusVariant = (status: DocStatusUI) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  const apiErrorMessage = useMemo(() => {
    const msg =
      (profileQuery.error as any)?.message ||
      (activityQuery.error as any)?.message ||
      (reviewDoc.error as any)?.message ||
      (sendReminder.error as any)?.message ||
      "";
    return typeof msg === "string" ? msg : "";
  }, [
    profileQuery.error,
    activityQuery.error,
    reviewDoc.error,
    sendReminder.error,
  ]);

  const refetchAll = async () => {
    await Promise.allSettled([profileQuery.refetch(), activityQuery.refetch()]);
  };

  if (!enabled) {
    return (
      <AdminLayout title="Driver Onboarding Review">
        <Card className="p-6 text-destructive">Invalid driver application id.</Card>
      </AdminLayout>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <AdminLayout title="Driver Onboarding Review">
        <Card className="p-6">Loading onboarding profile…</Card>
      </AdminLayout>
    );
  }

  if (profileQuery.error || !profileQuery.data) {
    return (
      <AdminLayout title="Driver Onboarding Review">
        <Card className="p-6 text-destructive space-y-2">
          <div>Failed to load onboarding profile.</div>
          {apiErrorMessage ? (
            <div className="text-sm text-muted-foreground">{apiErrorMessage}</div>
          ) : null}
        </Card>
      </AdminLayout>
    );
  }

  const { driver, documents } = profileQuery.data as any;
  const docs = Array.isArray(documents) ? documents : [];
  const activity = (activityQuery.data as any[]) || [];

  const busy =
    reviewDoc.isPending ||
    sendReminder.isPending ||
    profileQuery.isFetching ||
    activityQuery.isFetching;

  return (
    <AdminLayout title="Driver Onboarding Review">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* LEFT: documents */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Documents</h2>
              <div className="text-sm text-muted-foreground">
                {driver?.fullName ? String(driver.fullName) : "Driver"}{" "}
                {driver?.email ? `• ${String(driver.email)}` : ""}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{docs.length} total</Badge>

              <Button
                disabled={sendReminder.isPending}
                onClick={() => {
                  sendReminder.mutate(
                    {
                      driverApplicationId,
                      message: reminderMessage?.trim()
                        ? reminderMessage.trim()
                        : undefined,
                    },
                    {
                      onSuccess: async () => {
                        toast.success("Reminder sent");
                        setReminderMessage("");
                        await refetchAll();
                      },
                      onError: (e: any) => {
                        toast.error(e?.message || "Failed to send reminder");
                      },
                    }
                  );
                }}
              >
                {sendReminder.isPending ? "Sending…" : "Send reminder"}
              </Button>
            </div>
          </div>

          {/* Optional reminder message */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Optional reminder note</div>
            <Textarea
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              placeholder="Add a short message (optional)…"
            />
            <div className="text-xs text-muted-foreground">
              This will email the driver and log <b>REMINDER_SENT</b> in the timeline.
            </div>
          </div>

          {apiErrorMessage ? (
            <div className="text-sm text-destructive">{apiErrorMessage}</div>
          ) : null}

          {docs.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {docs.map((doc: any) => {
                const url = doc?.fileUrl ? String(doc.fileUrl) : "";
                const name = doc?.type || doc?.label || "Document";
                const status = doc?.status || "pending";
                const pdf = isPdf(doc?.mimeType, url);
                const filename = doc?.filename || filenameFromUrl(url);
                const reason = rejectionReasons[doc.id] ?? "";

                return (
                  <Card key={doc.id} className="p-4">
                    <div className="flex justify-between mb-3">
                      <div className="font-medium">{name}</div>
                      <Badge variant={statusVariant(status)}>{status}</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
                      <div className="border rounded-lg p-3 flex justify-center items-center">
                        {pdf ? (
                          <div className="text-sm">{filename}</div>
                        ) : (
                          <img
                            src={url}
                            alt={name}
                            className="max-h-[240px] rounded"
                          />
                        )}
                      </div>

                      <div className="space-y-3">
                        <Textarea
                          value={reason}
                          onChange={(e) =>
                            setRejectionReasons((p) => ({
                              ...p,
                              [doc.id]: e.target.value,
                            }))
                          }
                          placeholder="Rejection reason (required if rejecting)"
                        />

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            disabled={reviewDoc.isPending}
                            onClick={() =>
                              reviewDoc.mutate(
                                { docId: doc.id, status: "approved" },
                                {
                                  onSuccess: async () => {
                                    toast.success("Document approved");
                                    await refetchAll();
                                  },
                                  onError: (e: any) => {
                                    toast.error(e?.message || "Approve failed");
                                  },
                                }
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            className="flex-1"
                            variant="destructive"
                            disabled={reviewDoc.isPending}
                            onClick={() => {
                              const r = (reason || "").trim();
                              if (!r) {
                                toast.error("Rejection reason is required");
                                return;
                              }
                              reviewDoc.mutate(
                                {
                                  docId: doc.id,
                                  status: "rejected",
                                  rejectionReason: r,
                                },
                                {
                                  onSuccess: async () => {
                                    toast.success("Document rejected");
                                    await refetchAll();
                                  },
                                  onError: (e: any) => {
                                    toast.error(e?.message || "Reject failed");
                                  },
                                }
                              );
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>

        {/* RIGHT: activity timeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Activity</h3>
            <Button variant="secondary" disabled={busy} onClick={refetchAll}>
              {busy ? "Refreshing…" : "Refresh"}
            </Button>
          </div>

          {activityQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading activity…</div>
          ) : activity.length === 0 ? (
            <div className="text-sm text-muted-foreground">No activity yet.</div>
          ) : (
            <AdminActivityTimeline rows={activity} />
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
