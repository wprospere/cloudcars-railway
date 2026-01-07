/**
 * Database query helpers (Railway-safe)
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, asc, desc, and, isNull, inArray } from "drizzle-orm";
import * as schema from "../drizzle/schema";
import { createHash } from "crypto";

// ✅ Drizzle migrations (run on server boot)
import path from "path";
import { migrate } from "drizzle-orm/mysql2/migrator";

/**
 * Prefer DATABASE_URL (Railway standard).
 * Accept common Railway-provided variants.
 * Fallback to MYSQL* for non-Railway hosts.
 */
function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// ✅ Railway-safe DATABASE_URL resolution
const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQLDATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL;

// ✅ Connection pool
const pool = DATABASE_URL
  ? mysql.createPool({
      uri: DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  : mysql.createPool({
      host: required("MYSQLHOST"),
      port: Number(process.env.MYSQLPORT ?? "3306"),
      user: required("MYSQLUSER"),
      password: required("MYSQLPASSWORD"),
      database: required("MYSQLDATABASE"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

// ✅ Drizzle instance
export const db = drizzle(pool, { schema, mode: "default" });
export { schema };

/**
 * ✅ Run Drizzle migrations once (call this on server startup)
 * Safe to call multiple times; it only runs once per process.
 *
 * Your repo layout is:
 * - drizzle/meta/_journal.json
 * - drizzle/*.sql
 *
 * So migrationsFolder MUST be the parent folder: "drizzle"
 */
let migrationsRan = false;

export async function runMigrations() {
  if (migrationsRan) return;
  migrationsRan = true;

  const migrationsFolder = path.join(process.cwd(), "drizzle");
  console.log("🛠️ Running drizzle migrations from:", migrationsFolder);

  await migrate(db as any, { migrationsFolder });

  console.log("✅ Drizzle migrations complete");
}

/**
 * Helper: get insertId reliably across mysql2/drizzle versions
 */
async function insertAndReturnId<T>(q: Promise<T>): Promise<{ id: number }> {
  const res: any = await q;
  const id = res?.[0]?.insertId ?? res?.insertId ?? res?.[0]?.id ?? res?.id;

  if (!id) {
    throw new Error(
      `Insert succeeded but no insertId returned: ${JSON.stringify(res)}`
    );
  }
  return { id: Number(id) };
}

// -------------------- Bookings --------------------

export async function createBooking(data: typeof schema.bookings.$inferInsert) {
  return insertAndReturnId(db.insert(schema.bookings).values(data));
}

// -------------------- Driver Applications --------------------

export async function createDriverApplication(
  data: typeof schema.driverApplications.$inferInsert
) {
  return insertAndReturnId(db.insert(schema.driverApplications).values(data));
}

/**
 * ✅ Returns driver applications + their documents as `documents: []`
 * This powers completion badges on the Inquiries page.
 */
export async function getAllDriverApplications() {
  const apps = await db.query.driverApplications.findMany({
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });

  const ids = (apps as any[])
    .map((a) => Number(a.id))
    .filter((n) => Number.isFinite(n));

  if (ids.length === 0) {
    // attach empty docs so UI doesn't break
    return (apps as any[]).map((a) => ({ ...a, documents: [] }));
  }

  const docs = await db
    .select()
    .from(schema.driverDocuments)
    .where(inArray(schema.driverDocuments.driverApplicationId, ids));

  // Group documents by application id
  const byAppId = new Map<number, any[]>();
  for (const d of docs as any[]) {
    const appId = Number((d as any).driverApplicationId);
    if (!byAppId.has(appId)) byAppId.set(appId, []);
    byAppId.get(appId)!.push(d);
  }

  return (apps as any[]).map((a) => ({
    ...a,
    documents: byAppId.get(Number(a.id)) ?? [],
  }));
}

export async function updateDriverApplicationStatus(
  id: number,
  status: "pending" | "reviewing" | "approved" | "rejected"
) {
  await db
    .update(schema.driverApplications)
    .set({ status } as any)
    .where(eq(schema.driverApplications.id, id));
}

export async function updateDriverApplicationNotes(id: number, notes: string) {
  // Schema field is internalNotes
  await db
    .update(schema.driverApplications)
    .set({ internalNotes: notes } as any)
    .where(eq(schema.driverApplications.id, id));
}

export async function updateDriverApplicationAssignment(
  id: number,
  assignedTo: string | null
) {
  await db
    .update(schema.driverApplications)
    .set({ assignedTo } as any)
    .where(eq(schema.driverApplications.id, id));
}

// -------------------- Corporate Inquiries --------------------

export async function createCorporateInquiry(
  data: typeof schema.corporateInquiries.$inferInsert
) {
  return insertAndReturnId(db.insert(schema.corporateInquiries).values(data));
}

export async function getAllCorporateInquiries() {
  return db.query.corporateInquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
  });
}

export async function updateCorporateInquiryStatus(
  id: number,
  status: "pending" | "contacted" | "converted" | "declined"
) {
  await db
    .update(schema.corporateInquiries)
    .set({ status } as any)
    .where(eq(schema.corporateInquiries.id, id));
}

export async function updateCorporateInquiryNotes(id: number, notes: string) {
  // Schema field is internalNotes
  await db
    .update(schema.corporateInquiries)
    .set({ internalNotes: notes } as any)
    .where(eq(schema.corporateInquiries.id, id));
}

export async function updateCorporateInquiryAssignment(
  id: number,
  assignedTo: string | null
) {
  await db
    .update(schema.corporateInquiries)
    .set({ assignedTo } as any)
    .where(eq(schema.corporateInquiries.id, id));
}

// -------------------- Contact Messages --------------------

export async function createContactMessage(
  data: typeof schema.contactMessages.$inferInsert
) {
  return insertAndReturnId(db.insert(schema.contactMessages).values(data));
}

export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
}

export async function markContactMessageAsRead(id: number) {
  // Schema field is isRead
  await db
    .update(schema.contactMessages)
    .set({ isRead: true } as any)
    .where(eq(schema.contactMessages.id, id));
}

export async function updateContactMessageNotes(id: number, notes: string) {
  // Schema field is internalNotes
  await db
    .update(schema.contactMessages)
    .set({ internalNotes: notes } as any)
    .where(eq(schema.contactMessages.id, id));
}

export async function updateContactMessageAssignment(
  id: number,
  assignedTo: string | null
) {
  await db
    .update(schema.contactMessages)
    .set({ assignedTo } as any)
    .where(eq(schema.contactMessages.id, id));
}

// -------------------- Team Members --------------------

export async function getAllTeamMembers() {
  return db.query.teamMembers.findMany({
    orderBy: (members) => [asc(members.id)],
  });
}

export async function createTeamMember(
  name: string,
  email?: string,
  role?: string
) {
  return insertAndReturnId(
    db.insert(schema.teamMembers).values({
      name,
      email: email ?? null,
      role: role ?? null,
      isActive: true,
    } as any)
  );
}

export async function updateTeamMember(
  id: number,
  data: Partial<typeof schema.teamMembers.$inferInsert>
) {
  await db
    .update(schema.teamMembers)
    .set(data as any)
    .where(eq(schema.teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
}

// -------------------- Site Content (CMS) --------------------

export async function getSiteContent(sectionKey: string) {
  return db.query.siteContent.findFirst({
    where: (content, { eq }) => eq(content.sectionKey, sectionKey),
  });
}

export async function getAllSiteContent() {
  return db.query.siteContent.findMany({
    orderBy: (c, { asc }) => [asc(c.sectionKey)],
  });
}

export async function upsertSiteContent(
  data: typeof schema.siteContent.$inferInsert
) {
  const existing = await getSiteContent(String(data.sectionKey));
  if (existing) {
    await db
      .update(schema.siteContent)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(schema.siteContent.sectionKey, String(data.sectionKey)));
    return { id: existing.id };
  }
  return insertAndReturnId(db.insert(schema.siteContent).values(data as any));
}

// -------------------- Site Images (CMS) --------------------

export async function getSiteImage(imageKey: string) {
  return db.query.siteImages.findFirst({
    where: (image, { eq }) => eq(image.imageKey, imageKey),
  });
}

export async function getAllSiteImages() {
  return db.query.siteImages.findMany({
    orderBy: (i, { asc }) => [asc(i.imageKey)],
  });
}

export async function upsertSiteImage(
  data: typeof schema.siteImages.$inferInsert
) {
  const existing = await getSiteImage(String(data.imageKey));
  if (existing) {
    await db
      .update(schema.siteImages)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(schema.siteImages.imageKey, String(data.imageKey)));
    return { id: existing.id };
  }
  return insertAndReturnId(db.insert(schema.siteImages).values(data as any));
}

export async function deleteSiteImage(imageKey: string) {
  await db
    .delete(schema.siteImages)
    .where(eq(schema.siteImages.imageKey, imageKey));
}

// ============================================================================
// ✅ Phase 1.5 Driver Onboarding (Secure link + hardened tokens + vehicle + docs)
// ============================================================================

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export type TokenCheckReason =
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "TOKEN_USED"
  | "TOKEN_REVOKED";

/**
 * Revoke all active tokens for an application (prevents multiple valid links).
 */
export async function revokeActiveDriverOnboardingTokens(
  driverApplicationId: number
) {
  await db
    .update(schema.driverOnboardingTokens)
    .set({ revokedAt: new Date() } as any)
    .where(
      and(
        eq(
          schema.driverOnboardingTokens.driverApplicationId,
          driverApplicationId
        ),
        isNull(schema.driverOnboardingTokens.usedAt),
        isNull(schema.driverOnboardingTokens.revokedAt)
      )
    );
}

/**
 * ✅ Create a fresh onboarding token.
 * - Revokes existing active tokens for that driverApplicationId
 * - Stores only tokenHash
 * - Sets expiry (default 7 days if not provided)
 *
 * You email the RAW token in the link. You store ONLY the hash.
 */
export async function createDriverOnboardingToken(params: {
  driverApplicationId: number;
  rawToken: string;
  expiresAt?: Date; // optional; defaults to now + 7 days
  sentNow?: boolean; // if true, sets lastSentAt and sendCount
}) {
  const tokenHash = sha256(params.rawToken);
  const now = new Date();
  const expiresAt = params.expiresAt ?? addDays(now, 7);

  // Ensure only one active token at a time
  await revokeActiveDriverOnboardingTokens(params.driverApplicationId);

  await db.insert(schema.driverOnboardingTokens).values({
    driverApplicationId: params.driverApplicationId,
    tokenHash,
    expiresAt,
    usedAt: null,
    revokedAt: null,
    createdAt: now,
    lastSentAt: params.sentNow ? now : null,
    sendCount: params.sentNow ? 1 : 0,
  } as any);

  return { success: true, expiresAt };
}

/**
 * Low-level lookup:
 * Returns the token row even if expired/used/revoked (so UI can be friendly).
 */
export async function getDriverOnboardingTokenRow(rawToken: string) {
  const tokenHash = sha256(rawToken);

  const rows = await db
    .select()
    .from(schema.driverOnboardingTokens)
    .where(eq(schema.driverOnboardingTokens.tokenHash, tokenHash))
    .limit(1);

  return (rows as any[])[0] ?? null;
}

/**
 * Friendly validation for UI:
 * Returns {ok:true,row} OR {ok:false, reason}
 */
export async function checkDriverOnboardingToken(
  rawToken: string
): Promise<
  | { ok: true; row: typeof schema.driverOnboardingTokens.$inferSelect }
  | { ok: false; reason: TokenCheckReason }
> {
  const row: any = await getDriverOnboardingTokenRow(rawToken);
  if (!row) return { ok: false, reason: "TOKEN_INVALID" };

  if (row.revokedAt) return { ok: false, reason: "TOKEN_REVOKED" };
  if (row.usedAt) return { ok: false, reason: "TOKEN_USED" };

  const exp = new Date(row.expiresAt);
  if (exp.getTime() <= Date.now()) return { ok: false, reason: "TOKEN_EXPIRED" };

  return { ok: true, row };
}

/**
 * Backwards compatible:
 * Valid = exists AND not used AND not revoked AND not expired, else null.
 */
export async function getDriverOnboardingByToken(rawToken: string) {
  const res = await checkDriverOnboardingToken(rawToken);
  if (!res.ok) return null;
  return res.row;
}

/**
 * Lock token after submit (prevent re-use).
 * Call this ONLY after successful onboarding save.
 */
export async function markDriverOnboardingTokenUsed(rawToken: string) {
  const tokenHash = sha256(rawToken);

  await db
    .update(schema.driverOnboardingTokens)
    .set({ usedAt: new Date() } as any)
    .where(eq(schema.driverOnboardingTokens.tokenHash, tokenHash));
}

/**
 * Admin resend helper:
 * - revokes old active tokens
 * - inserts new token with lastSentAt/sendCount
 */
export async function resendDriverOnboardingToken(params: {
  driverApplicationId: number;
  rawToken: string;
  expiresAt?: Date;
}) {
  const now = new Date();
  const tokenHash = sha256(params.rawToken);
  const expiresAt = params.expiresAt ?? addDays(now, 7);

  await revokeActiveDriverOnboardingTokens(params.driverApplicationId);

  await db.insert(schema.driverOnboardingTokens).values({
    driverApplicationId: params.driverApplicationId,
    tokenHash,
    expiresAt,
    usedAt: null,
    revokedAt: null,
    createdAt: now,
    lastSentAt: now,
    sendCount: 1,
  } as any);

  return { success: true, expiresAt };
}

/**
 * Optional: if you ever re-send the SAME token (not recommended),
 * this bumps lastSentAt + sendCount.
 */
export async function bumpOnboardingTokenSent(rawToken: string) {
  const row: any = await getDriverOnboardingTokenRow(rawToken);
  if (!row) return { success: false };

  const nextCount = Number(row.sendCount ?? 0) + 1;

  await db
    .update(schema.driverOnboardingTokens)
    .set({ lastSentAt: new Date(), sendCount: nextCount } as any)
    .where(eq(schema.driverOnboardingTokens.id, Number(row.id)));

  return { success: true, sendCount: nextCount };
}

// -------------------- Vehicle --------------------

export async function upsertDriverVehicle(params: {
  driverApplicationId: number;
  registration: string;
  make: string;
  model: string;
  colour: string;
  year?: string | null;
  plateNumber?: string | null;
  capacity?: string | null;
}) {
  const existing = await db
    .select()
    .from(schema.driverVehicles)
    .where(
      eq(schema.driverVehicles.driverApplicationId, params.driverApplicationId)
    );

  if ((existing as any[]).length > 0) {
    await db
      .update(schema.driverVehicles)
      .set({
        registration: params.registration,
        make: params.make,
        model: params.model,
        colour: params.colour,
        year: params.year ?? null,
        plateNumber: params.plateNumber ?? null,
        capacity: params.capacity ?? null,
        updatedAt: new Date(),
      } as any)
      .where(
        eq(schema.driverVehicles.driverApplicationId, params.driverApplicationId)
      );

    return { success: true };
  }

  await db.insert(schema.driverVehicles).values({
    driverApplicationId: params.driverApplicationId,
    registration: params.registration,
    make: params.make,
    model: params.model,
    colour: params.colour,
    year: params.year ?? null,
    plateNumber: params.plateNumber ?? null,
    capacity: params.capacity ?? null,
  } as any);

  return { success: true };
}

export type DriverDocType =
  | "LICENSE_FRONT"
  | "LICENSE_BACK"
  | "BADGE"
  | "PLATING"
  | "INSURANCE"
  | "MOT";

export async function upsertDriverDocument(params: {
  driverApplicationId: number;
  type: DriverDocType;
  fileUrl: string;
  expiryDate?: Date | null;
}) {
  const existing = await db
    .select()
    .from(schema.driverDocuments)
    .where(
      and(
        eq(
          schema.driverDocuments.driverApplicationId,
          params.driverApplicationId
        ),
        eq(schema.driverDocuments.type, params.type as any)
      )
    );

  if ((existing as any[]).length > 0) {
    await db
      .update(schema.driverDocuments)
      .set({
        fileUrl: params.fileUrl,
        expiryDate: params.expiryDate ?? null,
        status: "pending",
        rejectionReason: null,
        reviewedAt: null,
        reviewedBy: null,
      } as any)
      .where(eq(schema.driverDocuments.id, (existing as any[])[0].id));

    return { success: true };
  }

  await db.insert(schema.driverDocuments).values({
    driverApplicationId: params.driverApplicationId,
    type: params.type as any,
    fileUrl: params.fileUrl,
    expiryDate: params.expiryDate ?? null,
    status: "pending",
  } as any);

  return { success: true };
}

export async function setDriverDocumentReview(params: {
  docId: number;
  status: "approved" | "rejected";
  reviewedBy: string;
  rejectionReason?: string | null;
}) {
  await db
    .update(schema.driverDocuments)
    .set({
      status: params.status,
      reviewedAt: new Date(),
      reviewedBy: params.reviewedBy,
      rejectionReason:
        params.status === "rejected"
          ? params.rejectionReason ?? "Rejected"
          : null,
    } as any)
    .where(eq(schema.driverDocuments.id, params.docId));
}

export async function getDriverOnboardingProfile(driverApplicationId: number) {
  const app = await db.query.driverApplications.findFirst({
    where: (a, { eq }) => eq(a.id, driverApplicationId),
  });

  const vehicle = await db.query.driverVehicles.findFirst({
    where: (v, { eq }) => eq(v.driverApplicationId, driverApplicationId),
  });

  const documents = await db.query.driverDocuments.findMany({
    where: (d, { eq }) => eq(d.driverApplicationId, driverApplicationId),
    orderBy: (d, { asc }) => [asc(d.type)],
  });

  // ✅ Return ALL common shapes so your UI never breaks:
  return {
    driverApplication: app ?? null,
    driver: app ?? null,
    application: app ?? null,
    vehicle: vehicle ?? null,
    documents,
  };
}
