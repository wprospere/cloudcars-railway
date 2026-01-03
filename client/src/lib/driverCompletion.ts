export type DocStatus = "approved" | "rejected" | "pending" | string;

export type DriverDocLike = {
  type?: string;        // e.g. "Driving Licence Front"
  status?: DocStatus;   // "approved" | "rejected" | "pending"
  fileUrl?: string | null;
};

const REQUIRED_DOC_TYPES = [
  "DRIVING_LICENCE_FRONT",
  "DRIVING_LICENCE_BACK",
  "PRIVATE_HIRE_BADGE",
  "INSURANCE",
  "MOT",
  "PROFILE_PHOTO",
] as const;

/**
 * Normalize whatever your DB stores into a stable key.
 * Adjust these mappings to match your actual `doc.type` values.
 */
export function normalizeDocType(raw: string | undefined | null) {
  const s = String(raw || "").trim().toLowerCase();

  if (s.includes("licence") && s.includes("front")) return "DRIVING_LICENCE_FRONT";
  if (s.includes("licence") && s.includes("back")) return "DRIVING_LICENCE_BACK";
  if (s.includes("private") && s.includes("hire")) return "PRIVATE_HIRE_BADGE";
  if (s.includes("insurance")) return "INSURANCE";
  if (s === "mot" || s.includes("mot")) return "MOT";
  if (s.includes("profile") || s.includes("selfie") || s.includes("photo")) return "PROFILE_PHOTO";

  // fallback: treat unknown as empty
  return "";
}

export function getDriverCompletionBadge(docs: DriverDocLike[] | undefined | null) {
  const list = Array.isArray(docs) ? docs : [];

  const uploaded = new Map<string, DriverDocLike>();
  for (const d of list) {
    const key = normalizeDocType(d.type);
    if (!key) continue;
    // only consider as "uploaded" if it has a fileUrl
    if (d.fileUrl) uploaded.set(key, d);
  }

  const missing = REQUIRED_DOC_TYPES.filter((t) => !uploaded.has(t));
  const rejected = Array.from(uploaded.values()).some(
    (d) => String(d.status || "").toLowerCase() === "rejected"
  );

  const approvedCount = Array.from(uploaded.values()).filter(
    (d) => String(d.status || "").toLowerCase() === "approved"
  ).length;

  const totalRequired = REQUIRED_DOC_TYPES.length;
  const uploadedCount = uploaded.size;

  if (rejected) {
    return {
      kind: "rejected" as const,
      text: "Rejected",
      variant: "destructive" as const,
      detail: `${approvedCount}/${totalRequired} approved`,
    };
  }

  if (missing.length === 0 && approvedCount === totalRequired) {
    return {
      kind: "complete" as const,
      text: "Complete",
      variant: "default" as const,
      detail: `${approvedCount}/${totalRequired} approved`,
    };
  }

  // Not rejected, not complete → pending/missing
  return {
    kind: "incomplete" as const,
    text:
      missing.length > 0
        ? `Missing ${missing.length}`
        : `Pending ${totalRequired - approvedCount}`,
    variant: "secondary" as const,
    detail: `${uploadedCount}/${totalRequired} uploaded • ${approvedCount}/${totalRequired} approved`,
  };
}
