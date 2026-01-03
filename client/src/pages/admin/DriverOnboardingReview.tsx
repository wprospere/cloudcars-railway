import { useState } from "react";
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
        {/* Driver */}
        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Driver</h2>
          <div>Name: {driver?.fullName}</div>
          <div>Email: {driver?.email}</div>
          <div>Phone: {driver?.phone}</div>
        </Card>

        {/* Vehicle */}
        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Vehicle</h2>
          <div>Registration: {vehicle?.registration}</div>
          <div>Make: {vehicle?.make}</div>
          <div>Model: {vehicle?.model}</div>
          <div>Colour: {vehicle?.colour}</div>
          <div>Year: {vehicle?.year}</div>
          <div>Plate: {vehicle?.plateNumber}</div>
          <div>Capacity: {vehicle?.capacity}</div>
        </Card>

        {/* Documents */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Documents</h2>

          {documents?.map((doc: any) => (
            <div key={doc.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
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

              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="underline text-sm"
              >
                View document
              </a>

              {doc.expiryDate && (
                <div className="text-sm text-muted-foreground">
                  Expiry: {new Date(doc.expiryDate).toLocaleDateString()}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    reviewDoc.mutate(
                      { docId: doc.id, status: "approved" },
                      { onSuccess: () => profileQuery.refetch() }
                    )
                  }
                >
                  Approve
                </Button>

                <RejectDoc
                  docId={doc.id}
                  onReject={(reason) =>
                    reviewDoc.mutate(
                      {
                        docId: doc.id,
                        status: "rejected",
                        rejectionReason: reason,
                      },
                      { onSuccess: () => profileQuery.refetch() }
                    )
                  }
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
}: {
  docId: number;
  onReject: (reason: string) => void;
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
        />
      </div>
      <Button
        size="sm"
        variant="destructive"
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

