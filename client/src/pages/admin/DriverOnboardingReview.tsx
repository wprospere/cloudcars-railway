import { useMemo, useRef, useState } from "react";
import type React from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DriverOnboardingReview() {
  const [, params] = useRoute("/admin/driver-onboarding/:id");
  const driverApplicationId = params?.id ? Number(params.id) : NaN;

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

  const [rejectionReasons, setRejectionReasons] = useState<Record<number, string>>(
    {}
  );

  const [zoom, setZoom] = useState({
    open: false,
    url: "",
    title: "",
  });

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const clampPan = (p: { x: number; y: number }, s: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || s <= 1) return { x: 0, y: 0 };

    const maxX = ((s - 1) * rect.width) / 2;
    const maxY = ((s - 1) * rect.height) / 2;

    return {
      x: clamp(p.x, -maxX, maxX),
      y: clamp(p.y, -maxY, maxY),
    };
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const statusVariant = (status: DocStatusUI) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

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
  const docs = Array.isArray(documents) ? documents : [];

  return (
    <AdminLayout title="Driver Onboarding Review">
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold">Documents</h2>
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
                              { onSuccess: () => profileQuery.refetch() }
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
                              { onSuccess: () => profileQuery.refetch() }
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
    </AdminLayout>
  );
}
