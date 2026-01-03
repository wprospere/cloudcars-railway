import { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
            <Button variant="outline" onClick={() => (window.location.href = "/admin/inquiries")}>
              Back to Inquiries
            </Button>
          </div>
        </Card>
      </AdminLayout>
    );
  }

  const { driver, vehicle, documents } = profileQuery.data as any;

  return (
    <AdminLayout
      title="Driver Onboarding Review"
      description="Review uploaded documents and vehicle details"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => (window.location.href = "/admin/inquiries")}>
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
          <h2 className="text-lg font-semibold">Documents</h2>

          {documents?.map((doc: any) => (
            <div key={doc.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{doc.type}</div>
                <Badge
                  variant={
                    doc.status === "approved"
                      ? "default"
                      : doc.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {doc.status || "pending"}
                </Badge>
              </div>

              {doc.fileUrl ? (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-sm"
                >
                  View document
                </a>
              ) : (
                <div className="text-sm text-muted-foreground">No file URL saved.</div>
              )}

              {doc.expiryDate && (
                <div className="text-sm text-muted-foreground">
                  Expiry: {new Date(doc.expiryDate).toLocaleDateString()}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={reviewDoc.isPending}
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

                <RejectDoc
                  docId={doc.id}
                  disabled={reviewDoc.isPending}
                  onReject={(reason) => {
                    const ok = confirm("Reject this document?");
                    if (!ok) return;

                    reviewDoc.mutate(
                      {
                        docId: doc.id,
                        status: "rejected",
                        rejectionReason: reason,
                      },
                      { onSuccess: () => profileQuery.refetch() }
                    );
                  }}
                />
              </div>
            </div>
          ))}

          {(!documents || documents.length === 0) && (
            <div className="text-muted-foreground text-sm">
              No documents uploaded yet.
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

function RejectDoc({
  docId,
  onReject,
  disabled,
}: {
  docId: number;
  onReject: (reason: string) => void;
  disabled?: boolean;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="flex gap-2 items-end">
      <div>
        <Label className="text-xs">Rejection reason</Label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-[220px]"
          disabled={disabled}
        />
      </div>
      <Button
        size="sm"
        variant="destructive"
        disabled={disabled}
        onClick={() => {
          if (!reason.trim()) {
            alert("Please enter a rejection reason");
            return;
          }
          onReject(reason);
          setReason("");
        }}
      >
        Reject
      </Button>
    </div>
  );
}
