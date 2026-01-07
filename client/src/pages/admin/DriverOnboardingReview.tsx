import { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const id = params?.id;
  const driverApplicationId = id ? Number(id) : NaN;

  const profileQuery = trpc.admin.getDriverOnboardingProfile.useQuery(
    { driverApplicationId },
    { enabled: Number.isFinite(driverApplicationId) && driverApplicationId > 0 }
  );

  const reviewDoc = trpc.admin.reviewDriverDocument.useMutation();

  const apiErrorMessage = useMemo(() => {
    const msg =
      (profileQuery.error as any)?.message ||
      (reviewDoc.error as any)?.message ||
      "";
    return typeof msg === "string" ? msg : "";
  }, [profileQuery.error, reviewDoc.error]);

  // ✅ Keep rejection reasons keyed by docId so you can type without losing state
  const [rejectionReasons, setRejectionReasons] = useState<Record<number, string>>(
    {}
  );

  if (!Number.isFinite(driverApplicationId) || driverApplicationId <= 0) {
    return (
      <AdminLayout title="Driver Onboarding">
        <Card className="p-6 text-destructive">Invalid driver id in URL.</Card>
      </AdminLayout>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <AdminLayout title="Driver Onboarding">
        <Card className="p-6">Loading onboarding profile…</Card>
      </AdminLayout>
    );
  }

  if (profileQuery.error || !profileQuery.data) {
    return (
      <AdminLayout title="Driver Onboarding">
        <Card className="p-6 text-destructive">
          Failed to load onboarding profile.
          {apiErrorMessage ? (
            <div className="text-sm mt-2 opacity-90">{apiErrorMessage}</div>
          ) : null}
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/inquiries")}
            >
              Back to Inquiries
            </Button>
          </div>
        </Card>
      </AdminLayout>
    );
  }

  const { driver, vehicle, documents } = profileQuery.data as any;

  const docs = Array.isArray(documents) ? documents : [];

  const statusVariant = (status: DocStatusUI) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <AdminLayout
      title="Driver Onboarding Review"
      description="Review uploaded documents and vehicle details"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/admin/inquiries")}
          >
            Back to Inquiries
          </Button>
        </div>

        {apiErrorMessage ? (
          <Card className="p-4 border border-destructive/40 bg-destructive/10">
            <div className="font-semibold">Action error</div>
            <div className="text-sm mt-1">{apiErrorMessage}</div>
          </Card>
        ) : null}

        {/* Driver */}
        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Driver</h2>
          <div>Name: {driver?.fullName || "-"}</div>
          <div>Email: {driver?.email || "-"}</div>
          <div>Phone: {driver?.phone || "-"}</div>
        </Card>

        {/* Vehicle */}
        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Vehicle</h2>
          <div>Registration: {vehicle?.registration || "-"}</div>
          <div>Make: {vehicle?.make || "-"}</div>
          <div>Model: {vehicle?.model || "-"}</div>
          <div>Colour: {vehicle?.colour || "-"}</div>
          <div>Year: {vehicle?.year || "-"}</div>
          <div>Plate: {vehicle?.plateNumber || "-"}</div>
          <div>Capacity: {vehicle?.capacity || "-"}</div>
        </Card>

        {/* Documents */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Documents</h2>
              <p className="text-sm text-muted-foreground">
                Review each document and approve or reject with a reason.
              </p>
            </div>
            <Badge variant="secondary">{docs.length} total</Badge>
          </div>

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
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="font-medium">{name}</div>
                      <Badge variant={statusVariant(status)}>{status}</Badge>
                    </div>

                    {doc.expiryDate ? (
                      <div className="text-sm text-muted-foreground mb-3">
                        Expiry: {new Date(doc.expiryDate).toLocaleDateString()}
                      </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
                      {/* LEFT: preview */}
                      <div className="rounded-lg border border-border bg-secondary/20 p-3 flex items-center justify-center min-h-[220px]">
                        {!url ? (
                          <div className="text-sm text-muted-foreground">
                            No file URL saved.
                          </div>
                        ) : pdf ? (
                          <div className="w-full flex flex-col gap-3">
                            <div className="text-sm text-muted-foreground">
                              PDF document: <span className="font-medium">{filename}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={url} target="_blank" rel="noreferrer">
                                  Open
                                </a>
                              </Button>

                              <Button size="sm" variant="outline" asChild>
                                <a href={url} download>
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={url}
                            alt={name}
                            className="max-h-[320px] w-auto object-contain rounded-md"
                          />
                        )}
                      </div>

                      {/* RIGHT: actions */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`reject-${doc.id}`} className="text-sm">
                            Rejection reason
                          </Label>
                          <Textarea
                            id={`reject-${doc.id}`}
                            value={reason}
                            onChange={(e) =>
                              setRejectionReasons((prev) => ({
                                ...prev,
                                [doc.id]: e.target.value,
                              }))
                            }
                            placeholder="Required only if rejecting…"
                            rows={5}
                            disabled={reviewDoc.isPending}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            disabled={reviewDoc.isPending || !url}
                            onClick={() => {
                              const ok = confirm("Approve this document?");
                              if (!ok) return;

                              reviewDoc.mutate(
                                { docId: doc.id, status: "approved" },
                                { onSuccess: () => profileQuery.refetch() }
                              );
                            }}
                          >
                            {reviewDoc.isPending ? "Saving..." : "Approve"}
                          </Button>

                          <Button
                            className="flex-1"
                            variant="destructive"
                            disabled={reviewDoc.isPending || !url}
                            onClick={() => {
                              const trimmed = reason.trim();
                              if (!trimmed) {
                                alert("Please enter a rejection reason");
                                return;
                              }

                              const ok = confirm("Reject this document?");
                              if (!ok) return;

                              reviewDoc.mutate(
                                {
                                  docId: doc.id,
                                  status: "rejected",
                                  rejectionReason: trimmed,
                                },
                                {
                                  onSuccess: () => {
                                    profileQuery.refetch();
                                    setRejectionReasons((prev) => ({
                                      ...prev,
                                      [doc.id]: "",
                                    }));
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
      </div>
    </AdminLayout>
  );
}