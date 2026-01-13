import { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { AdminActivityTimeline } from "@/components/admin/AdminActivityTimeline";

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
  // ✅ wouter param: /admin/driver-onboarding/:id
  const [, params] = useRoute("/admin/driver-onboarding/:id");
  const driverApplicationId = params?.id ? Number(params.id) : NaN;

  const enabled =
    Number.isFinite(driverApplicationId) && driverApplicationId > 0;

  const profileQuery = trpc.admin.getDriverOnboardingProfile.useQuery(
    { driverApplicationId },
    { enabled }
  );

  // ✅ Activity timeline (separate endpoint)
  const activityQuery = trpc.admin.getActivity.useQuery(
    {
      entityType: "driver_application",
      entityId: driverApplicationId,
      limit: 50,
    },
    { enabled }
  );

  const reviewDoc = trpc.admin.reviewDriverDocument.useMutation();

  const apiErrorMessage = useMemo(() => {
    const msg =
      (profileQuery.error as any)?.message ||
      (activityQuery.error as any)?.message ||
      (reviewDoc.error as any)?.message ||
      "";
    return typeof msg === "string" ? msg : "";
  }, [profileQuery.error, activityQuery.error, reviewDoc.error]);

  const [rejectionReasons, setRejectionReasons] = useState<
    Record<number, string>
  >({});

  const statusVariant = (status: DocStatusUI) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

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
        <Card className="p-6 text-destructive">
          Failed to load onboarding profile.
        </Card>
      </AdminLayout>
    );
  }

  const { documents } = profileQuery.data as any;
  const docs = Array.isArray(documents) ? documents : [];

  return (
    <AdminLayout title="Driver Onboarding Review">
      <div className="grid gap-4 md:grid-cols-[1fr_380px]">
        {/* LEFT: Documents */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold">Documents</h2>
            <Badge variant="secondary">{docs.length} total</Badge>
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
                            onClick={() =>
                              reviewDoc.mutate(
                                { docId: doc.id, status: "approved" },
                                {
                                  onSuccess: () => {
                                    profileQuery.refetch();
                                    activityQuery.refetch();
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
                            onClick={() =>
                              reviewDoc.mutate(
                                {
                                  docId: doc.id,
                                  status: "rejected",
                                  rejectionReason: reason,
                                },
                                {
                                  onSuccess: () => {
                                    profileQuery.refetch();
                                    activityQuery.refetch();
                                  },
                                }
                              )
                            }
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

        {/* RIGHT: Activity timeline */}
        <div className="space-y-4">
          {activityQuery.isLoading ? (
            <Card className="p-4 text-sm text-muted-foreground">
              Loading activity…
            </Card>
          ) : activityQuery.error ? (
            <Card className="p-4 text-sm text-destructive">
              Failed to load activity.
            </Card>
          ) : (
            <AdminActivityTimeline
              title="Admin Activity"
              rows={(activityQuery.data as any) || []}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
