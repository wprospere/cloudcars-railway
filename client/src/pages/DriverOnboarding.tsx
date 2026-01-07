import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type DocType =
  | "LICENSE_FRONT"
  | "LICENSE_BACK"
  | "BADGE"
  | "PLATING"
  | "INSURANCE"
  | "MOT";

type DocStatus = "pending" | "approved" | "rejected";

const DOCS: {
  type: DocType;
  label: string;
  hint?: string;
  requiresExpiry?: boolean;
}[] = [
  {
    type: "LICENSE_FRONT",
    label: "Driving Licence (Front)",
    hint: "Make sure your photo, name and licence number are clear.",
  },
  {
    type: "LICENSE_BACK",
    label: "Driving Licence (Back)",
    hint: "Make sure categories and dates are readable.",
  },
  {
    type: "BADGE",
    label: "Taxi Badge",
    hint: "Front side, not cropped, badge number visible.",
  },
  {
    type: "PLATING",
    label: "Taxi Plating / Plate",
    hint: "Certificate/photo showing vehicle + plate details.",
  },
  {
    type: "INSURANCE",
    label: "Insurance",
    hint: "Must show your name, reg plate and expiry date.",
    requiresExpiry: true,
  },
  {
    type: "MOT",
    label: "MOT",
    hint: "Pass certificate or screenshot showing reg + expiry.",
    requiresExpiry: true,
  },
];

// -------------------------
// Token helpers
// -------------------------

function getTokenFromWindow(): string {
  if (typeof window === "undefined") return "";
  const sp = new URLSearchParams(window.location.search);
  return sp.get("token") || "";
}

/**
 * UK registration validation (covers common modern formats):
 * - Current format: AA99AAA (e.g. AB12CDE)
 * - Prefix: A999AAA (e.g. A123BCD)
 * - Suffix: AAA999A (e.g. ABC123D)
 * - Dateless: 1–3 letters + 1–3 numbers, or vice versa (basic support)
 *
 * We validate after removing spaces and uppercasing.
 */
function isUkReg(reg: string): boolean {
  const v = reg.replace(/\s+/g, "").toUpperCase();

  const current = /^[A-Z]{2}\d{2}[A-Z]{3}$/; // AB12CDE
  const prefix = /^[A-Z]\d{1,3}[A-Z]{3}$/; // A123BCD
  const suffix = /^[A-Z]{3}\d{1,3}[A-Z]$/; // ABC123D

  // basic dateless support (not perfect, but good guard)
  const dateless1 = /^[A-Z]{1,3}\d{1,3}$/; // ABC123
  const dateless2 = /^\d{1,3}[A-Z]{1,3}$/; // 123ABC

  return (
    current.test(v) ||
    prefix.test(v) ||
    suffix.test(v) ||
    dateless1.test(v) ||
    dateless2.test(v)
  );
}

function formatUkReg(reg: string): string {
  return reg.replace(/\s+/g, "").toUpperCase();
}

async function fileToBase64(file: File): Promise<string> {
  // returns base64 WITHOUT the "data:mime;base64," prefix
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const res = String(reader.result || "");
      const base64 = res.includes(",") ? res.split(",")[1] : res;
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

function mimeAllowed(mime: string) {
  // allow images + pdf
  return (
    mime.startsWith("image/") ||
    mime === "application/pdf" ||
    mime === "application/octet-stream"
  );
}

function prettyDocLabel(type: DocType) {
  return DOCS.find((d) => d.type === type)?.label ?? type;
}

function statusBadgeVariant(status?: DocStatus) {
  // Badge variants available: "default" | "secondary" | "destructive" | "outline" (typical shadcn)
  if (!status) return "secondary";
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "secondary"; // pending
}

function statusText(status?: DocStatus) {
  if (!status) return "Not uploaded";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending review";
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function isImageFile(file: File | null | undefined) {
  return !!file && file.type.startsWith("image/");
}

function isPdfFile(file: File | null | undefined) {
  return !!file && file.type === "application/pdf";
}

// -------------------------
// Premium: image rotation + compression via canvas
// -------------------------

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * ✅ Auto-compress images (Option 1):
 * - target ~4MB for fast uploads
 * - hard max 6MB
 * - keep quality >= 0.60 (protects small text)
 * - if still too big: shrink dimensions instead of nuking quality
 * - PDFs are not compressed (returned unchanged)
 */
async function compressImageFile(
  file: File,
  opts?: {
    targetBytes?: number; // aim for this (recommended 4MB)
    hardMaxBytes?: number; // never exceed this (hard limit 6MB)
    maxSidePx?: number; // first-pass max dimension
    minSidePx?: number; // fallback smaller dimension if still too big
    initialQuality?: number;
    minQuality?: number; // keep text readable
    qualityStep?: number;
  }
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const targetBytes = opts?.targetBytes ?? 4 * 1024 * 1024;
  const hardMaxBytes = opts?.hardMaxBytes ?? 6 * 1024 * 1024;
  const maxSidePx = opts?.maxSidePx ?? 2200;
  const minSidePx = opts?.minSidePx ?? 1600;

  const initialQuality = opts?.initialQuality ?? 0.85;
  const minQuality = opts?.minQuality ?? 0.6;
  const qualityStep = opts?.qualityStep ?? 0.07;

  const img = await loadImageFromFile(file);

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  async function renderToJpegBlob(sideLimit: number, quality: number): Promise<Blob> {
    const maxSide = Math.max(srcW, srcH);
    const scale = maxSide > sideLimit ? sideLimit / maxSide : 1;

    const targetW = Math.max(1, Math.round(srcW * scale));
    const targetH = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetW, targetH);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to compress image"))),
        "image/jpeg",
        quality
      );
    });
  }

  const isOversizeBytes = file.size > targetBytes;
  const isOversizeDims = Math.max(srcW, srcH) > maxSidePx;
  if (!isOversizeBytes && !isOversizeDims) return file;

  // Pass 1: resize to maxSidePx, reduce quality (down to minQuality) to hit targetBytes
  let side = maxSidePx;
  let q = initialQuality;
  let blob = await renderToJpegBlob(side, q);

  while (blob.size > targetBytes && q > minQuality) {
    q = Math.max(minQuality, q - qualityStep);
    blob = await renderToJpegBlob(side, q);
  }

  // Pass 2: if still above HARD cap, shrink dimensions (preferred) and only then drop quality a bit
  if (blob.size > hardMaxBytes) {
    side = minSidePx;
    q = Math.max(q, minQuality);
    blob = await renderToJpegBlob(side, q);

    while (blob.size > hardMaxBytes && q > minQuality) {
      q = Math.max(minQuality, q - qualityStep);
      blob = await renderToJpegBlob(side, q);
    }
  }

  const newName = file.name.replace(/\.(\w+)$/, "") + "-optimised.jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

async function rotateImageFile(file: File, direction: "left" | "right"): Promise<File> {
  const img = await loadImageFromFile(file);

  const angle = direction === "left" ? -90 : 90;
  const radians = (angle * Math.PI) / 180;

  // Canvas size swaps width/height for 90-degree rotation
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  canvas.width = h;
  canvas.height = w;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -w / 2, -h / 2);

  // Rotate output as JPEG to avoid PNG bloat + ensure future compression is consistent
  const outputType = "image/jpeg";
  const quality = 0.92;

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to export rotated image"))),
      outputType,
      quality
    );
  });

  const newName = file.name.replace(/\.(\w+)$/, "") + `-rotated.jpg`;
  return new File([blob], newName, { type: outputType });
}

export default function DriverOnboardingPage() {
  // wouter
  const [location] = useLocation();

  // Optional fallback route: /driver/onboarding/:token
  const [, params] = useRoute("/driver/onboarding/:token");

  // ✅ Robust token resolution:
  // 1) ?token=... from window.location.search
  // 2) /driver/onboarding/:token param
  const token = useMemo(() => {
    const fromQuery = getTokenFromWindow();
    if (fromQuery) return fromQuery;

    const fromParam = (params as any)?.token;
    if (typeof fromParam === "string" && fromParam.length >= 10) return fromParam;

    // last resort: try parse query from wouter location (sometimes includes ?...)
    const hasQ = location.includes("?");
    if (hasQ) {
      const sp = new URLSearchParams(location.split("?")[1]);
      return sp.get("token") || "";
    }

    return "";
  }, [location, params]);

  // Basic UI state
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusErr, setStatusErr] = useState<string | null>(null);

  // Vehicle form state
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [year, setYear] = useState("");
  const [licencePlate, setLicencePlate] = useState(""); // renamed
  const [capacity, setCapacity] = useState("");

  // Document UI state
  const [selectedFiles, setSelectedFiles] = useState<Record<DocType, File | null>>({
    LICENSE_FRONT: null,
    LICENSE_BACK: null,
    BADGE: null,
    PLATING: null,
    INSURANCE: null,
    MOT: null,
  });

  const [expiryDates, setExpiryDates] = useState<Record<DocType, string>>({
    LICENSE_FRONT: "",
    LICENSE_BACK: "",
    BADGE: "",
    PLATING: "",
    INSURANCE: "",
    MOT: "",
  });

  const [uploading, setUploading] = useState<Record<DocType, boolean>>({
    LICENSE_FRONT: false,
    LICENSE_BACK: false,
    BADGE: false,
    PLATING: false,
    INSURANCE: false,
    MOT: false,
  });

  const [activeDoc, setActiveDoc] = useState<DocType>("LICENSE_FRONT");

  // Premium: per-doc preview URLs
  const [previewUrls, setPreviewUrls] = useState<Record<DocType, string | null>>({
    LICENSE_FRONT: null,
    LICENSE_BACK: null,
    BADGE: null,
    PLATING: null,
    INSURANCE: null,
    MOT: null,
  });

  // Keep track of previous URLs to revoke (memory-safe)
  const prevPreviewUrlsRef = useRef(previewUrls);

  useEffect(() => {
    prevPreviewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    // When selectedFiles changes, update preview URL for affected doc(s)
    // and revoke old URLs to prevent memory leaks.
    (Object.keys(selectedFiles) as DocType[]).forEach((t) => {
      const file = selectedFiles[t];
      const currentUrl = previewUrls[t];

      if (!file) {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        if (currentUrl) setPreviewUrls((p) => ({ ...p, [t]: null }));
        return;
      }

      if (!currentUrl) {
        const url = URL.createObjectURL(file);
        setPreviewUrls((p) => ({ ...p, [t]: url }));
      }
    });

    // Cleanup on unmount: revoke all
    return () => {
      (Object.keys(previewUrls) as DocType[]).forEach((t) => {
        const url = previewUrls[t];
        if (url) URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  // -------------------------
  // tRPC calls
  // -------------------------
  const profileQuery = trpc.driverOnboarding.getByToken.useQuery(
    { token },
    { enabled: !!token }
  );

  const saveVehicle = trpc.driverOnboarding.saveVehicle.useMutation();
  const uploadDocument = trpc.driverOnboarding.uploadDocument.useMutation();
  const submitOnboarding = trpc.driverOnboarding.submit.useMutation();

  // Pre-fill vehicle fields if profile has existing data
  useEffect(() => {
    if (!profileQuery.data) return;

    const vehicle = (profileQuery.data as any)?.vehicle;
    if (vehicle) {
      setRegistration(vehicle.registration ?? "");
      setMake(vehicle.make ?? "");
      setModel(vehicle.model ?? "");
      setColour(vehicle.colour ?? "");
      setYear(vehicle.year ?? "");
      setLicencePlate(vehicle.plateNumber ?? ""); // DB field stays plateNumber
      setCapacity(vehicle.capacity ?? "");
    }
  }, [profileQuery.data]);

  // Determine uploaded documents from profile
  const uploadedDocs = useMemo(() => {
    const docs: any[] = (profileQuery.data as any)?.documents ?? [];
    const map = new Map<DocType, any>();
    for (const d of docs) {
      if (d?.type) map.set(d.type, d);
    }
    return map;
  }, [profileQuery.data]);

  const docsProgress = useMemo(() => {
    const total = DOCS.length;
    const uploaded = DOCS.filter((d) => uploadedDocs.has(d.type)).length;
    const approved = DOCS.filter((d) => uploadedDocs.get(d.type)?.status === "approved")
      .length;
    const rejected = DOCS.filter((d) => uploadedDocs.get(d.type)?.status === "rejected")
      .length;
    const pending = DOCS.filter((d) => uploadedDocs.get(d.type)?.status === "pending")
      .length;
    return { total, uploaded, approved, rejected, pending };
  }, [uploadedDocs]);

  const allRequiredUploaded = useMemo(() => {
    return DOCS.every((d) => uploadedDocs.has(d.type));
  }, [uploadedDocs]);

  const allApproved = useMemo(() => {
    return DOCS.every((d) => uploadedDocs.get(d.type)?.status === "approved");
  }, [uploadedDocs]);

  const showError = (msg: string) => {
    setStatusErr(msg);
    setStatusMsg(null);
  };

  const showMsg = (msg: string) => {
    setStatusMsg(msg);
    setStatusErr(null);
  };

  function validateVehicle(): string | null {
    if (!registration || !make || !model || !colour) {
      return "Please fill Registration, Make, Model, and Colour.";
    }

    const reg = formatUkReg(registration);
    if (!isUkReg(reg)) {
      return "Registration doesn't look like a valid UK reg (e.g. AB12CDE).";
    }

    if (licencePlate) {
      const lp = formatUkReg(licencePlate);
      if (!isUkReg(lp)) {
        return "Licence Plate doesn't look like a valid UK reg (e.g. AB12CDE).";
      }
    }

    return null;
  }

  async function handleSaveVehicle() {
    setStatusErr(null);
    setStatusMsg(null);

    if (!token) return showError("Missing token in URL.");

    const validationError = validateVehicle();
    if (validationError) return showError(validationError);

    await saveVehicle.mutateAsync({
      token,
      registration: formatUkReg(registration),
      make,
      model,
      colour,
      year: year || undefined,
      plateNumber: licencePlate ? formatUkReg(licencePlate) : undefined,
      capacity: capacity || undefined,
    });

    showMsg("✅ Vehicle details saved.");
    profileQuery.refetch();
  }

  function docExpiryRequired(type: DocType) {
    return DOCS.find((d) => d.type === type)?.requiresExpiry ?? false;
  }

  function nextDocType(current: DocType): DocType | null {
    const idx = DOCS.findIndex((d) => d.type === current);
    if (idx < 0) return null;
    const next = DOCS[idx + 1]?.type;
    return next ?? null;
  }

  function clearSelected(type: DocType) {
    const url = previewUrls[type];
    if (url) URL.revokeObjectURL(url);

    setPreviewUrls((p) => ({ ...p, [type]: null }));
    setSelectedFiles((prev) => ({ ...prev, [type]: null }));
  }

  async function handleRotate(type: DocType, direction: "left" | "right") {
    setStatusErr(null);
    setStatusMsg(null);

    const file = selectedFiles[type];
    if (!file) return showError("Select an image first.");
    if (!isImageFile(file)) return showError("Rotate is only available for images.");

    try {
      setUploading((prev) => ({ ...prev, [type]: true }));

      const before = file.size;

      const rotated = await rotateImageFile(file, direction);

      // ✅ compress after rotate (target 4MB, hard max 6MB)
      const optimised = await compressImageFile(rotated, {
        targetBytes: 4 * 1024 * 1024,
        hardMaxBytes: 6 * 1024 * 1024,
        maxSidePx: 2200,
        minSidePx: 1600,
        initialQuality: 0.85,
        minQuality: 0.6,
        qualityStep: 0.07,
      });

      // Hard guard (should rarely happen now)
      const hardMax = 6 * 1024 * 1024;
      if (optimised.size > hardMax) {
        throw new Error("This image is still too large after optimisation. Please use a smaller photo.");
      }

      // Revoke old preview URL and set new file
      const oldUrl = previewUrls[type];
      if (oldUrl) URL.revokeObjectURL(oldUrl);

      setSelectedFiles((prev) => ({ ...prev, [type]: optimised }));
      setPreviewUrls((p) => ({ ...p, [type]: URL.createObjectURL(optimised) }));

      if (optimised.size < before) {
        showMsg(`✅ Rotated & optimised (${formatBytes(before)} → ${formatBytes(optimised.size)}).`);
      } else {
        showMsg("✅ Rotated. Please check preview then upload.");
      }
    } catch (e: any) {
      showError(e?.message || "Failed to rotate image.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  }

  async function handleUpload(type: DocType) {
    setStatusErr(null);
    setStatusMsg(null);

    if (!token) return showError("Missing token in URL.");

    const file = selectedFiles[type];
    if (!file) return showError(`Please choose a file for ${prettyDocLabel(type)}.`);

    if (!mimeAllowed(file.type)) {
      return showError("File type not supported. Please upload an image or PDF.");
    }

    if (docExpiryRequired(type)) {
      const exp = (expiryDates[type] ?? "").trim();
      if (!exp) return showError(`Please add an expiry date for ${prettyDocLabel(type)}.`);
    }

    try {
      setUploading((prev) => ({ ...prev, [type]: true }));

      const hardMaxBytes = 6 * 1024 * 1024;

      let fileToSend = file;
      const before = file.size;

      // ✅ Auto-compress images (PDF untouched)
      if (fileToSend.type.startsWith("image/")) {
        fileToSend = await compressImageFile(fileToSend, {
          targetBytes: 4 * 1024 * 1024,
          hardMaxBytes: 6 * 1024 * 1024,
          maxSidePx: 2200,
          minSidePx: 1600,
          initialQuality: 0.85,
          minQuality: 0.6,
          qualityStep: 0.07,
        });

        // Sync UI file + preview to what will actually be uploaded
        if (fileToSend !== file) {
          const oldUrl = previewUrls[type];
          if (oldUrl) URL.revokeObjectURL(oldUrl);
          setSelectedFiles((prev) => ({ ...prev, [type]: fileToSend }));
          setPreviewUrls((p) => ({ ...p, [type]: URL.createObjectURL(fileToSend) }));
        }
      }

      // Hard size guard
      if (fileToSend.size > hardMaxBytes) {
        return showError("File is too large. Please upload a file under 6MB.");
      }

      const base64Data = await fileToBase64(fileToSend);

      await uploadDocument.mutateAsync({
        token,
        type,
        base64Data,
        mimeType: fileToSend.type || "application/octet-stream",
        expiryDate: expiryDates[type]
          ? new Date(expiryDates[type]).toISOString()
          : undefined,
      });

      if (fileToSend.size < before) {
        showMsg(
          `✅ Uploaded: ${prettyDocLabel(type)} (optimised ${formatBytes(before)} → ${formatBytes(
            fileToSend.size
          )}, now pending review)`
        );
      } else {
        showMsg(`✅ Uploaded: ${prettyDocLabel(type)} (now pending review)`);
      }

      // Clear selected + preview
      clearSelected(type);

      await profileQuery.refetch();

      const next = nextDocType(type);
      if (next) setActiveDoc(next);
    } catch (e: any) {
      showError(e?.message || "Upload failed.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  }

  async function handleSubmit() {
    setStatusErr(null);
    setStatusMsg(null);

    if (!token) return showError("Missing token in URL.");

    const validationError = validateVehicle();
    if (validationError)
      return showError("Please fix vehicle details first: " + validationError);

    if (!allRequiredUploaded) {
      return showError("Please upload all required documents before submitting.");
    }

    await submitOnboarding.mutateAsync({ token });
    showMsg("✅ Onboarding submitted! We’ll review your documents and contact you.");
    profileQuery.refetch();
  }

  // -------------------------
  // Render states
  // -------------------------
  if (!token) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Driver Onboarding</h1>
          <p className="text-muted-foreground">
            This link is missing a token. Please use the onboarding link sent to you.
          </p>
        </Card>
      </div>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card className="p-6">Loading onboarding details…</Card>
      </div>
    );
  }

  if (profileQuery.error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Driver Onboarding</h1>
          <p className="text-destructive">
            {profileQuery.error.message || "Invalid onboarding link."}
          </p>
        </Card>
      </div>
    );
  }

  const driver =
    (profileQuery.data as any)?.driverApplication ||
    (profileQuery.data as any)?.driver ||
    (profileQuery.data as any)?.application;

  const vehicleValidationError = validateVehicle();
  const canSubmit =
    !vehicleValidationError && allRequiredUploaded && !submitOnboarding.isPending;

  const progressPct = Math.round((docsProgress.uploaded / docsProgress.total) * 100);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      {/* Header + Status */}
      <Card className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Driver Onboarding</h1>
            <p className="text-muted-foreground">
              Complete your vehicle details and upload your documents. Most drivers finish in{" "}
              <span className="font-medium">5–8 minutes</span>.
            </p>

            {driver?.fullName && (
              <div className="pt-2 text-sm">
                <span className="text-muted-foreground">Driver:</span>{" "}
                <span className="font-medium">{driver.fullName}</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <Badge variant={allApproved ? "default" : "secondary"}>
              {allApproved ? "Approved" : "In progress"}
            </Badge>
            <div className="mt-2 text-xs text-muted-foreground">
              {docsProgress.uploaded}/{docsProgress.total} uploaded
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-foreground transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {docsProgress.approved > 0 && (
              <span className="mr-2">✅ {docsProgress.approved} approved</span>
            )}
            {docsProgress.pending > 0 && (
              <span className="mr-2">⏳ {docsProgress.pending} pending</span>
            )}
            {docsProgress.rejected > 0 && <span>❌ {docsProgress.rejected} rejected</span>}
          </div>
        </div>

        {statusErr && (
          <div className="mt-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            {statusErr}
          </div>
        )}
        {statusMsg && (
          <div className="mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            {statusMsg}
          </div>
        )}
      </Card>

      {/* Vehicle Details */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Vehicle Details</h2>
            <div className="text-xs text-muted-foreground">
              Required: Registration, Make, Model, Colour
            </div>
          </div>

          <Button onClick={handleSaveVehicle} disabled={saveVehicle.isPending}>
            {saveVehicle.isPending ? "Saving..." : "Save Vehicle"}
          </Button>
        </div>

        {vehicleValidationError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            {vehicleValidationError}
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            ✅ Vehicle details look good
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Registration (Required)</Label>
            <Input
              value={registration}
              onChange={(e) => setRegistration(formatUkReg(e.target.value))}
              placeholder="e.g. AB12CDE"
              inputMode="text"
              autoCapitalize="characters"
            />
          </div>
          <div>
            <Label>Make (Required)</Label>
            <Input value={make} onChange={(e) => setMake(e.target.value)} />
          </div>
          <div>
            <Label>Model (Required)</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
          <div>
            <Label>Colour (Required)</Label>
            <Input value={colour} onChange={(e) => setColour(e.target.value)} />
          </div>
          <div>
            <Label>Year</Label>
            <Input value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div>
            <Label>Licence Plate</Label>
            <Input
              value={licencePlate}
              onChange={(e) => setLicencePlate(formatUkReg(e.target.value))}
              placeholder="Optional"
              inputMode="text"
              autoCapitalize="characters"
            />
          </div>
          <div>
            <Label>Capacity</Label>
            <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          UK reg example: <span className="font-medium">AB12CDE</span>
        </div>
      </Card>

      {/* Documents */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Documents</h2>
            <div className="text-xs text-muted-foreground">
              Upload each item below. Preview and rotate images before uploading.
              <span className="ml-1">Large photos are automatically optimised.</span>
            </div>
          </div>

          <Badge variant={allRequiredUploaded ? "default" : "secondary"}>
            {allRequiredUploaded ? "All Uploaded" : "Upload Remaining"}
          </Badge>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DOCS.map((d) => {
            const existing = uploadedDocs.get(d.type);
            const status: DocStatus | undefined = existing?.status;
            const isSelected = activeDoc === d.type;

            return (
              <button
                key={d.type}
                type="button"
                onClick={() => setActiveDoc(d.type)}
                className={`rounded-lg border p-3 text-left transition ${
                  isSelected ? "border-foreground" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{d.label}</div>
                  <Badge variant={statusBadgeVariant(status) as any}>
                    {statusText(status)}
                  </Badge>
                </div>

                {status === "rejected" && existing?.rejectionReason && (
                  <div className="mt-2 text-xs text-destructive">
                    Reason: {existing.rejectionReason}
                  </div>
                )}

                {d.hint && (
                  <div className="mt-1 text-xs text-muted-foreground">{d.hint}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Focused uploader */}
        {(() => {
          const doc = DOCS.find((d) => d.type === activeDoc)!;
          const existing = uploadedDocs.get(activeDoc);
          const status: DocStatus | undefined = existing?.status;
          const isUploading = uploading[activeDoc];
          const file = selectedFiles[activeDoc];
          const previewUrl = previewUrls[activeDoc];

          return (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{doc.label}</div>
                  {doc.hint && (
                    <div className="text-xs text-muted-foreground mt-1">{doc.hint}</div>
                  )}
                </div>
                <Badge variant={statusBadgeVariant(status) as any}>
                  {statusText(status)}
                </Badge>
              </div>

              {existing?.fileUrl && (
                <div className="text-sm">
                  <a
                    className="underline"
                    href={existing.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View uploaded file
                  </a>
                  {typeof status === "string" && (
                    <span className="ml-2 text-muted-foreground">(Status: {status})</span>
                  )}
                </div>
              )}

              {status === "rejected" && existing?.rejectionReason && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
                  <div className="font-medium">Rejected</div>
                  <div className="text-sm mt-1">{existing.rejectionReason}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Please re-upload a clearer/correct document.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Choose file (image or PDF, under 6MB)</Label>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      if (!f) return;

                      if (!mimeAllowed(f.type)) {
                        showError("File type not supported. Please upload an image or PDF.");
                        return;
                      }

                      setSelectedFiles((prev) => ({ ...prev, [activeDoc]: f }));
                    }}
                  />
                  {file?.name && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Selected: {file.name} • {formatBytes(file.size)}
                      {isImageFile(file) && file.size > 4 * 1024 * 1024 ? (
                        <span className="ml-1">(will be optimised)</span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div>
                  <Label>
                    Expiry date{" "}
                    {docExpiryRequired(activeDoc) ? (
                      <span className="text-destructive">(required)</span>
                    ) : (
                      <span className="text-muted-foreground">(optional)</span>
                    )}
                  </Label>
                  <Input
                    type="date"
                    value={expiryDates[activeDoc]}
                    onChange={(e) =>
                      setExpiryDates((prev) => ({
                        ...prev,
                        [activeDoc]: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* ✅ Premium Preview */}
              {file && previewUrl && (
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">Preview</div>
                    <div className="flex items-center gap-2">
                      {isImageFile(file) && (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleRotate(activeDoc, "left")}
                            disabled={isUploading}
                          >
                            Rotate ⟲
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleRotate(activeDoc, "right")}
                            disabled={isUploading}
                          >
                            Rotate ⟳
                          </Button>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => clearSelected(activeDoc)}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {isImageFile(file) && (
                    <div className="overflow-hidden rounded-md border bg-muted">
                      <img
                        src={previewUrl}
                        alt="Selected document preview"
                        className="w-full h-auto block"
                      />
                    </div>
                  )}

                  {isPdfFile(file) && (
                    <div className="overflow-hidden rounded-md border bg-muted">
                      <iframe
                        src={previewUrl}
                        title="PDF preview"
                        className="w-full"
                        style={{ height: 420 }}
                      />
                    </div>
                  )}

                  {!isImageFile(file) && !isPdfFile(file) && (
                    <div className="text-xs text-muted-foreground">
                      Preview not available for this file type.
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Tip: If text looks blurry here, it will likely be rejected — retake in
                    better light.
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleUpload(activeDoc)}
                  disabled={isUploading || uploadDocument.isPending}
                >
                  {isUploading ? "Uploading..." : existing?.fileUrl ? "Re-upload" : "Upload"}
                </Button>

                {nextDocType(activeDoc) && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveDoc(nextDocType(activeDoc)!)}
                  >
                    Next
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Accepted formats: JPG/PNG/PDF • Images auto-optimised to ~4MB • Max size: 6MB
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Submit */}
      <Card className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Submit for Review</h2>
            <p className="text-sm text-muted-foreground">
              When vehicle details are saved and all documents are uploaded, submit for review.
            </p>
          </div>
          <Badge variant={canSubmit ? "default" : "secondary"}>
            {canSubmit ? "Ready" : "Not ready"}
          </Badge>
        </div>

        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {submitOnboarding.isPending ? "Submitting..." : "Submit"}
        </Button>

        {!allRequiredUploaded && (
          <div className="text-xs text-muted-foreground">
            Upload all required documents to enable submission.
          </div>
        )}
        {vehicleValidationError && (
          <div className="text-xs text-muted-foreground">
            Save valid vehicle details to enable submission.
          </div>
        )}
      </Card>
    </div>
  );
}
