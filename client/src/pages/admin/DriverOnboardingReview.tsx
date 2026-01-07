import { useMemo, useRef, useState } from "react";
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

  // ✅ Image zoom modal state
  const [zoom, setZoom] = useState<{
    open: boolean;
    url: string;
    title: string;
  }>({ open: false, url: "", title: "" });

  // ✅ Pan/zoom state (modal only)
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  /**
   * ✅ Clamp pan so you can't drag the image off-screen into empty space.
   * We clamp based on viewport size and zoom level:
   * - At scale 1 => no pan (0,0)
   * - As scale increases => allowed pan grows, but bounded.
   */
  const clampPan = (p: { x: number; y: number }, s: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return p;

    if (s <= 1) return { x: 0, y: 0 };

    // Allow pan up to half the "extra" size introduced by zoom.
    // This keeps the image covering the viewport without exposing too much empty background.
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

  const setScaleClamped = (nextScale: number) => {
    const s = clamp(nextScale, 1, 6);
    setScale(s);
    setPan((prev) => clampPan(prev, s));
  };

  const zoomBy = (factor: number) => {
    setScale((prev) => {
      const next = clamp(Number((prev * factor).toFixed(3)), 1, 6);
      setPan((p) => clampPan(p, next));
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY;
    const zoomFactor = delta > 0 ? 0.9 : 1.1;

    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) {
      zoomBy(zoomFactor);
      return;
    }

    // Cursor position relative to center (for zoom-to-cursor feel)
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;

    setScale((prevScale) => {
      const nextScale = clamp(Number((prevScale * zoomFactor).toFixed(3)), 1, 6);
      const ratio = nextScale / prevScale;

      setPan((prevPan) => {
        const nextPan = {
          x: prevPan.x - cx * (ratio - 1),
          y: prevPan.y - cy * (ratio - 1),
        };
        return clampPan(nextPan, nextScale);
      });

      return nextScale;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const next = { x: panStart.current.x + dx, y: panStart.current.y + dy };
    setPan(clampPan(next, scale));
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const statusVariant = (status: DocStatusUI) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

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

  return (
    <AdminLayout
      title="Driver Onboarding Review"
      description="Review uploaded documents and vehicle details"
    >
      {/* ✅ Image zoom dialog w/ clamped pan+zoom */}
      <Dialog
        open={zoom.open}
        onOpenChange={(open) => {
          if (!open) {
            setZoom({ open: false, url: "", title: "" });
            resetView();
            return;
          }
          setZoom((prev) => ({ ...prev, open }));
          resetView();
        }}
      >
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{zoom.title || "Document"}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-xs text-muted-foreground">
              Wheel to zoom • Drag to pan • Double-click to reset
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => zoomBy(1.15)}
                disabled={!zoom.url}
              >
                Zoom +
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => zoomBy(0.87)}
                disabled={!zoom.url}
              >
                Zoom −
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  resetView();
                }}
                disabled={!zoom.url}
              >
                Reset
              </Button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className={[
              "relative rounded-lg border border-border bg-secondary/20",
              "h-[75vh] overflow-hidden",
              isDragging
                ? "cursor-grabbing"
                : scale > 1
                ? "cursor-grab"
                : "cursor-default",
            ].join(" ")}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={() => resetView()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoom.url}
                alt={zoom.title}
                draggable={false}
                className="select-none max-h-none max-w-none"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 80ms linear",
                  willChange: "transform",
                }}
              />
            </div>

            <div className="absolute bottom-3 left-3 rounded-full border border-border bg-background/80 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
              {Math.round(scale * 100)}%
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <Button variant="outline" asChild disabled={!zoom.url}>
              <a href={zoom.url} download>
                Download
              </a>
            </Button>

            <Button
              onClick={() => {
                setZoom({ open: false, url: "", title: "" });
                resetView();
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                Review each document and approve or reject with a reason. Click
                images to zoom (pan/zoom is clamped).
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
                              PDF document:{" "}
                              <span className="font-medium">{filename}</span>
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
                          <button
                            type="button"
                            className="group relative"
                            onClick={() => {
                              setZoom({ open: true, url, title: name });
                              resetView();
                            }}
                            aria-label={`Zoom ${name}`}
                            title="Click to zoom"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={name}
                              className="max-h-[320px] w-auto object-contain rounded-md transition group-hover:opacity-95"
                              draggable={false}
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-primary/30 group-hover:ring-2 transition" />
                            <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-background/80 border border-border px-2 py-1 text-[11px] text-muted-foreground">
                              Click to zoom
                            </div>
                          </button>
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
