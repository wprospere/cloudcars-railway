import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

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

const DOCS: { type: DocType; label: string; hint?: string }[] = [
  { type: "LICENSE_FRONT", label: "Driving Licence (Front)" },
  { type: "LICENSE_BACK", label: "Driving Licence (Back)" },
  { type: "BADGE", label: "Taxi Badge" },
  { type: "PLATING", label: "Taxi Plating / Plate" },
  { type: "INSURANCE", label: "Insurance" },
  { type: "MOT", label: "MOT" },
];

function useQueryToken() {
  return useMemo(() => {
    if (typeof window === "undefined") return "";
    const sp = new URLSearchParams(window.location.search);
    return sp.get("token") || "";
  }, []);
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

/* -------------------------
   ✅ UK reg helpers
------------------------- */
function normalizeUkReg(input: string) {
  // Uppercase, remove spaces/dashes, keep only A–Z 0–9
  return input
    .toUpperCase()
    .replace(/[\s-]+/g, "")
    .replace(/[^A-Z0-9]/g, "");
}

function isValidUkReg(normalized: string) {
  // Expect normalized (no spaces)
  // Covers:
  // - Current format: AA11AAA
  // - Prefix: A123ABC
  // - Suffix: ABC123A
  // - Dateless private plates (common)
  // - NI: ABC1234 (3 letters + 1–4 numbers)
  const current = /^[A-Z]{2}\d{2}[A-Z]{3}$/; // AA11AAA
  const prefix = /^[A-Z]\d{1,3}[A-Z]{3}$/; // A123ABC
  const suffix = /^[A-Z]{3}\d{1,3}[A-Z]$/; // ABC123A
  const dateless1 = /^[A-Z]{1,3}\d{1,4}$/; // ABC1234 / AB12 / A1
  const dateless2 = /^\d{1,4}[A-Z]{1,3}$/; // 1ABC / 12AB
  const ni = /^[A-Z]{3}\d{1,4}$/; // ABC1234 (NI style)

  return (
    current.test(normalized) ||
    prefix.test(normalized) ||
    suffix.test(normalized) ||
    dateless1.test(normalized) ||
    dateless2.test(normalized) ||
    ni.test(normalized)
  );
}

function formatUkRegForDisplay(normalized: string) {
  // Add a space for modern style plates: AA11 AAA
  if (/^[A-Z]{2}\d{2}[A-Z]{3}$/.test(normalized)) {
    return `${normalized.slice(0, 4)} ${normalized.slice(4)}`;
  }
  return normalized;
}

export default function DriverOnboardingPage() {
  const token = useQueryToken();

  // Basic UI state
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusErr, setStatusErr] = useState<string | null>(null);

  // Vehicle form state
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [year, setYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  // Document UI state
  const [selectedFiles, setSelectedFiles] = useState<
    Record<DocType, File | null>
  >({
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
      // show formatted if possible
      setPlateNumber(
        formatUkRegForDisplay(normalizeUkReg(vehicle.plateNumber ?? ""))
      );
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

  const allRequiredUploaded = useMemo(() => {
    return DOCS.every((d) => uploadedDocs.has(d.type));
  }, [uploadedDocs]);

  const showError = (msg: string) => {
    setStatusErr(msg);
    setStatusMsg(null);
  };

  const showMsg = (msg: string) => {
    setStatusMsg(msg);
    setStatusErr(null);
  };

  async function handleSaveVehicle() {
    setStatusErr(null);
    setStatusMsg(null);

    if (!token) return showError("Missing token in URL.");
    if (!registration || !make || !model || !colour) {
      return showError("Please fill Registration, Make, Model, and Colour.");
    }

    const normalizedPlate = normalizeUkReg(plateNumber);
    if (plateNumber && !isValidUkReg(normalizedPlate)) {
      return showError(
        "Licence plate looks invalid. Please enter a UK registration (e.g. AB12 CDE)."
      );
    }

    await saveVehicle.mutateAsync({
      token,
      registration,
      make,
      model,
      colour,
      year: year || undefined,
      plateNumber: normalizedPlate || undefined,
      capacity: capacity || undefined,
    });

    showMsg("✅ Vehicle details saved.");
    profileQuery.refetch();
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

    // Optional: basic size guard (helps avoid huge payloads)
    const maxBytes = 6 * 1024 * 1024; // 6MB
    if (file.size > maxBytes) {
      return showError("File is too large. Please upload a file under 6MB.");
    }

    try {
      setUploading((prev) => ({ ...prev, [type]: true }));

      const base64Data = await fileToBase64(file);

      await uploadDocument.mutateAsync({
        token,
        type,
        base64Data,
        mimeType: file.type || "application/octet-stream",
        expiryDate: expiryDates[type]
          ? new Date(expiryDates[type]).toISOString()
          : undefined,
      });

      showMsg(`✅ Uploaded: ${prettyDocLabel(type)}`);
      setSelectedFiles((prev) => ({ ...prev, [type]: null }));
      profileQuery.refetch();
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

    // Vehicle minimal required check
    if (!registration || !make || !model || !colour) {
      return showError("Please save your vehicle details first.");
    }

    const normalizedPlate = normalizeUkReg(plateNumber);
    if (plateNumber && !isValidUkReg(normalizedPlate)) {
      return showError(
        "Licence plate looks invalid. Please enter a UK registration (e.g. AB12 CDE)."
      );
    }

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

  const driver = (profileQuery.data as any)?.driverApplication;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Card className="p-6 space-y-2">
        <h1 className="text-2xl font-bold">Driver Onboarding</h1>
        <p className="text-muted-foreground">
          Please complete your vehicle details and upload required documents.
        </p>

        {driver?.fullName && (
          <div className="pt-2 text-sm">
            <span className="text-muted-foreground">Driver:</span>{" "}
            <span className="font-medium">{driver.fullName}</span>
          </div>
        )}

        {statusErr && (
          <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            {statusErr}
          </div>
        )}
        {statusMsg && (
          <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            {statusMsg}
          </div>
        )}
      </Card>

      {/* Vehicle Details */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Vehicle Details</h2>
          <Button onClick={handleSaveVehicle} disabled={saveVehicle.isPending}>
            {saveVehicle.isPending ? "Saving..." : "Save Vehicle"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Registration (Required)</Label>
            <Input
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
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
            <Label>Licence Plate Number</Label>
            <Input
              value={plateNumber}
              onChange={(e) => {
                const normalized = normalizeUkReg(e.target.value);
                setPlateNumber(formatUkRegForDisplay(normalized));
              }}
              placeholder="e.g. AB12 CDE"
              inputMode="text"
              autoCapitalize="characters"
              spellCheck={false}
            />
            {plateNumber && !isValidUkReg(normalizeUkReg(plateNumber)) && (
              <div className="text-xs text-destructive mt-1">
                Please enter a valid UK registration (e.g. AB12 CDE).
              </div>
            )}
          </div>
          <div>
            <Label>Capacity</Label>
            <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Documents */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Required Documents</h2>
          <Badge variant={allRequiredUploaded ? "default" : "secondary"}>
            {allRequiredUploaded ? "All Uploaded" : "Pending Uploads"}
          </Badge>
        </div>

        <div className="space-y-4">
          {DOCS.map((doc) => {
            const existing = uploadedDocs.get(doc.type);
            const isUploading = uploading[doc.type];

            return (
              <div key={doc.type} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{doc.label}</div>
                  {existing?.fileUrl ? (
                    <Badge>Uploaded</Badge>
                  ) : (
                    <Badge variant="secondary">Not uploaded</Badge>
                  )}
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
                    {existing?.status && (
                      <span className="ml-2 text-muted-foreground">
                        (Status: {existing.status})
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Upload file (image or PDF, under 6MB)</Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setSelectedFiles((prev) => ({ ...prev, [doc.type]: f }));
                      }}
                    />
                    {selectedFiles[doc.type]?.name && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Selected: {selectedFiles[doc.type]!.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Expiry date (optional)</Label>
                    <Input
                      type="date"
                      value={expiryDates[doc.type]}
                      onChange={(e) =>
                        setExpiryDates((prev) => ({
                          ...prev,
                          [doc.type]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleUpload(doc.type)}
                    disabled={isUploading || uploadDocument.isPending}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Submit */}
      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">Submit</h2>
        <p className="text-sm text-muted-foreground">
          Once you have saved vehicle details and uploaded all documents, submit for
          review.
        </p>

        <Button
          onClick={handleSubmit}
          disabled={submitOnboarding.isPending || !allRequiredUploaded}
        >
          {submitOnboarding.isPending ? "Submitting..." : "Submit for Review"}
        </Button>

        {!allRequiredUploaded && (
          <div className="text-xs text-muted-foreground">
            Upload all required documents to enable submission.
          </div>
        )}
      </Card>
    </div>
  );
}
