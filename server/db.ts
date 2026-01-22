/**
 * Database query helpers (Railway LIVE only)
 * - Requires DATABASE_URL
 * - Drizzle mysql2
 * - Includes migrations + admin activity audit trail
 */

import "dotenv/config";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, asc, desc, and, isNull, inArray, sql } from "drizzle-orm";
import * as schema from "../drizzle/schema";
import { createHash } from "crypto";

import path from "path";
import { migrate } from "drizzle-orm/mysql2/migrator";

/**
 * Railway LIVE ONLY:
 * We REQUIRE DATABASE_URL and do not fall back to MYSQLHOST/MYSQLUSER/etc.
 */
function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const DATABASE_URL = requiredEnv("DATABASE_URL");

// ✅ Connection pool (single pool per process)
const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
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
 * So migrationsFolder MUST be: "drizzle"
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

// ============================================================================
// ✅ Admin Activity (audit trail) — SINGLE implementation
// ============================================================================

export type AdminEntityType =
  | "driver_application"
  | "corporate_inquiry"
  | "contact_message";

export type AdminActivityAction =
  | "CREATED"
  | "STATUS_CHANGED"
  | "ASSIGNED"
  | "NOTE_ADDED"
  | "LINK_SENT"
  | "REMINDER_SENT"
  | "DOC_REVIEWED";

const adminActivityTable = schema.adminActivity;

export async function logAdminActivity(params: {
  entityType: AdminEntityType;
  entityId: number;
  action: AdminActivityAction;
  adminEmail?: string | null;
  meta?: unknown;
  createdAt?: Date;
}) {
  const metaText =
    typeof params.meta === "undefined"
      ? null
      : JSON.stringify(params.meta ?? null);

  await db.insert(adminActivityTable).values({
    entityType: params.entityType as any,
    entityId: params.entityId,
    action: params.action as any,
    adminEmail: params.adminEmail ?? null,
    meta: metaText,
    createdAt: params.createdAt ?? new Date(),
  } as any);

  return { success: true };
}

/**
 * Fetch audit timeline for a given entity.
 * Newest first.
 */
export async function getAdminActivityForEntity(params: {
  entityType: AdminEntityType;
  entityId: number;
  limit?: number;
}) {
  const limit = Math.max(1, Math.min(Number(params.limit ?? 50), 200));

  const rows = await db.query.adminActivity.findMany({
    where: (a, { eq, and }) =>
      and(
        eq(a.entityType as any, params.entityType as any),
        eq(a.entityId as any, params.entityId as any)
      ),
    orderBy: (a, { desc }) => [desc(a.createdAt)],
    limit,
  });

  return (rows as any[]).map((r) => {
    let meta: any = null;
    try {
      meta = r.meta ? JSON.parse(String(r.meta)) : null;
    } catch {
      meta = r.meta ?? null;
    }
    return { ...r, meta };
  });
}

// ============================================================================
// ✅ Helpers for "last touched" + lightweight ownership
// ============================================================================

async function touchDriverApplication(params: {
  id: number;
  adminEmail?: string | null;
}) {
  await db
    .update(schema.driverApplications)
    .set({
      lastTouchedAt: new Date(),
      lastTouchedByEmail: params.adminEmail ?? null,
    } as any)
    .where(eq(schema.driverApplications.id, params.id));
}

/**
 * Optionally auto-fill assignedToEmail/AdminId for queue workflows.
 * Safe to call even if fields are not used by UI yet.
 */
async function setDriverAssignmentFields(params: {
  id: number;
  assignedToEmail?: string | null;
  assignedToAdminId?: number | null;
  legacyAssignedTo?: string | null;
  adminEmail?: string | null; // actor
}) {
  await db
    .update(schema.driverApplications)
    .set({
      // legacy (kept)
      assignedTo: params.legacyAssignedTo ?? null,

      // new
      assignedToEmail: params.assignedToEmail ?? null,
      assignedToAdminId: params.assignedToAdminId ?? null,

      lastTouchedAt: new Date(),
      lastTouchedByEmail: params.adminEmail ?? null,
    } as any)
    .where(eq(schema.driverApplications.id, params.id));
}

// -------------------- Bookings --------------------

export async function createBooking(data: typeof schema.bookings.$inferInsert) {
  return insertAndReturnId(db.insert(schema.bookings).values(data));
}

// -------------------- Driver Applications --------------------

export type DriverAppStatus =
  | "pending"
  | "reviewing"
  | "link_sent"
  | "docs_received"
  | "approved"
  | "rejected";

export async function createDriverApplication(
  data: typeof schema.driverApplications.$inferInsert
) {
  const res = await insertAndReturnId(
    db.insert(schema.driverApplications).values(data)
  );

  // Audit (public form)
  await logAdminActivity({
    entityType: "driver_application",
    entityId: res.id,
    action: "CREATED",
    adminEmail: null,
    meta: { source: "public_form" },
  });

  return res;
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
    return (apps as any[]).map((a) => ({ ...a, documents: [] }));
  }

  const docs = await db
    .select()
    .from(schema.driverDocuments)
    .where(inArray(schema.driverDocuments.driverApplicationId, ids));

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
  status: DriverAppStatus,
  adminEmail?: string | null
) {
  const existing = await db.query.driverApplications.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });

  await db
    .update(schema.driverApplications)
    .set({
      status,
      lastTouchedAt: new Date(),
      lastTouchedByEmail: adminEmail ?? null,
    } as any)
    .where(eq(schema.driverApplications.id, id));

  await logAdminActivity({
    entityType: "driver_application",
    entityId: id,
    action: "STATUS_CHANGED",
    adminEmail: adminEmail ?? null,
    meta: { from: existing?.status ?? null, to: status },
  });
}

export async function updateDriverApplicationNotes(
  id: number,
  notes: string,
  adminEmail?: string | null
) {
  await db
    .update(schema.driverApplications)
    .set({
      internalNotes: notes,
      lastTouchedAt: new Date(),
      lastTouchedByEmail: adminEmail ?? null,
    } as any)
    .where(eq(schema.driverApplications.id, id));

  await logAdminActivity({
    entityType: "driver_application",
    entityId: id,
    action: "NOTE_ADDED",
    adminEmail: adminEmail ?? null,
    meta: { length: Number(notes?.length ?? 0) },
  });
}

/**
 * Legacy assignment (kept): assignedTo string
 * New queue fields are optional: assignedToEmail + assignedToAdminId
 */
export async function updateDriverApplicationAssignment(
  id: number,
  assignedTo: string | null,
  adminEmail?: string | null,
  opts?: {
    assignedToEmail?: string | null;
    assignedToAdminId?: number | null;
  }
) {
  const existing = await db.query.driverApplications.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });

  await setDriverAssignmentFields({
    id,
    legacyAssignedTo: assignedTo ?? null,
    assignedToEmail: opts?.assignedToEmail ?? null,
    assignedToAdminId: opts?.assignedToAdminId ?? null,
    adminEmail: adminEmail ?? null,
  });

  await logAdminActivity({
    entityType: "driver_application",
    entityId: id,
    action: "ASSIGNED",
    adminEmail: adminEmail ?? null,
    meta: {
      from: existing?.assignedTo ?? null,
      to: assignedTo,
      assignedToEmail: opts?.assignedToEmail ?? null,
      assignedToAdminId: opts?.assignedToAdminId ?? null,
    },
  });
}

// -------------------- Corporate Inquiries --------------------

export async function createCorporateInquiry(
  data: typeof schema.corporateInquiries.$inferInsert
) {
  const res = await insertAndReturnId(
    db.insert(schema.corporateInquiries).values(data)
  );

  await logAdminActivity({
    entityType: "corporate_inquiry",
    entityId: res.id,
    action: "CREATED",
    adminEmail: null,
    meta: { source: "public_form" },
  });

  return res;
}

export async function getAllCorporateInquiries() {
  return db.query.corporateInquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
  });
}

export async function updateCorporateInquiryStatus(
  id: number,
  status: "pending" | "contacted" | "converted" | "declined",
  adminEmail?: string | null
) {
  const existing = await db.query.corporateInquiries.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });

  await db
    .update(schema.corporateInquiries)
    .set({ status } as any)
    .where(eq(schema.corporateInquiries.id, id));

  await logAdminActivity({
    entityType: "corporate_inquiry",
    entityId: id,
    action: "STATUS_CHANGED",
    adminEmail: adminEmail ?? null,
    meta: { from: existing?.status ?? null, to: status },
  });
}

export async function updateCorporateInquiryNotes(
  id: number,
  notes: string,
  adminEmail?: string | null
) {
  await db
    .update(schema.corporateInquiries)
    .set({ internalNotes: notes } as any)
    .where(eq(schema.corporateInquiries.id, id));

  await logAdminActivity({
    entityType: "corporate_inquiry",
    entityId: id,
    action: "NOTE_ADDED",
    adminEmail: adminEmail ?? null,
    meta: { length: Number(notes?.length ?? 0) },
  });
}

export async function updateCorporateInquiryAssignment(
  id: number,
  assignedTo: string | null,
  adminEmail?: string | null
) {
  const existing = await db.query.corporateInquiries.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });

  await db
    .update(schema.corporateInquiries)
    .set({ assignedTo } as any)
    .where(eq(schema.corporateInquiries.id, id));

  await logAdminActivity({
    entityType: "corporate_inquiry",
    entityId: id,
    action: "ASSIGNED",
    adminEmail: adminEmail ?? null,
    meta: { from: existing?.assignedTo ?? null, to: assignedTo },
  });
}

// -------------------- Contact Messages --------------------

export async function createContactMessage(
  data: typeof schema.contactMessages.$inferInsert
) {
  const res = await insertAndReturnId(
    db.insert(schema.contactMessages).values(data)
  );

  await logAdminActivity({
    entityType: "contact_message",
    entityId: res.id,
    action: "CREATED",
    adminEmail: null,
    meta: { source: "public_form" },
  });

  return res;
}

export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
}

export async function markContactMessageAsRead(
  id: number,
  adminEmail?: string | null
) {
  await db
    .update(schema.contactMessages)
    .set({ isRead: true } as any)
    .where(eq(schema.contactMessages.id, id));

  await logAdminActivity({
    entityType: "contact_message",
    entityId: id,
    action: "STATUS_CHANGED",
    adminEmail: adminEmail ?? null,
    meta: { field: "isRead", to: true },
  });
}

export async function updateContactMessageNotes(
  id: number,
  notes: string,
  adminEmail?: string | null
) {
  await db
    .update(schema.contactMessages)
    .set({ internalNotes: notes } as any)
    .where(eq(schema.contactMessages.id, id));

  await logAdminActivity({
    entityType: "contact_message",
    entityId: id,
    action: "NOTE_ADDED",
    adminEmail: adminEmail ?? null,
    meta: { length: Number(notes?.length ?? 0) },
  });
}

export async function updateContactMessageAssignment(
  id: number,
  assignedTo: string | null,
  adminEmail?: string | null
) {
  const existing = await db.query.contactMessages.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  });

  await db
    .update(schema.contactMessages)
    .set({ assignedTo } as any)
    .where(eq(schema.contactMessages.id, id));

  await logAdminActivity({
    entityType: "contact_message",
    entityId: id,
    action: "ASSIGNED",
    adminEmail: adminEmail ?? null,
    meta: { from: existing?.assignedTo ?? null, to: assignedTo },
  });
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

/**
 * ✅ We store either:
 *   - a STORAGE KEY (recommended) e.g. "cms/2026-01-22/abc.png"
 *   - OR a stable public URL (https://...)
 *   - OR a client-bundled absolute path (/assets/...)
 *
 * We DO NOT want /uploads/* in production (Railway disk is ephemeral).
 * If you really want local uploads, set ALLOW_LOCAL_UPLOADS=true
 */
function normalizeSiteImageUrlOrKey(input: any): string | null {
  if (input == null) return null;

  const raw = String(input).trim();
  if (!raw) return null;

  const allowLocal =
    String(process.env.ALLOW_LOCAL_UPLOADS || "").toLowerCase() === "true";

  if (!allowLocal && raw.startsWith("/uploads/")) {
    throw new Error(
      "Refusing to save /uploads/* in production. Upload to S3 and store the key, or set ALLOW_LOCAL_UPLOADS=true (not recommended)."
    );
  }

  // Absolute path for client assets is ok
  if (raw.startsWith("/")) return raw;

  // Full URL is ok
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // Otherwise treat as STORAGE KEY (this is what your routers.ts uses)
  // e.g. "cms/2026-01-22/xyz.png"
  return raw.replace(/^\/+/, "");
}

export async function upsertSiteImage(
  data: typeof schema.siteImages.$inferInsert
) {
  const imageKey = String((data as any).imageKey);

  const cleaned = {
    ...data,
    imageKey,
    url:
      typeof (data as any).url === "undefined"
        ? (data as any).url
        : normalizeSiteImageUrlOrKey((data as any).url),
    updatedAt: new Date(),
  } as any;

  const existing = await getSiteImage(imageKey);
  if (existing) {
    await db
      .update(schema.siteImages)
      .set(cleaned)
      .where(eq(schema.siteImages.imageKey, imageKey));
    return { id: existing.id };
  }

  return insertAndReturnId(db.insert(schema.siteImages).values(cleaned));
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
 * Also:
 * - logs LINK_SENT
 * - updates driverApplications.status -> link_sent
 * - touches lastTouched fields
 */
export async function createDriverOnboardingToken(params: {
  driverApplicationId: number;
  rawToken: string;
  expiresAt?: Date;
  sentNow?: boolean;
  adminEmail?: string | null;
}) {
  const tokenHash = sha256(params.rawToken);
  const now = new Date();
  const expiresAt = params.expiresAt ?? addDays(now, 7);

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

  if (params.sentNow) {
    await db
      .update(schema.driverApplications)
      .set({
        status: "link_sent",
        lastTouchedAt: now,
        lastTouchedByEmail: params.adminEmail ?? null,
      } as any)
      .where(eq(schema.driverApplications.id, params.driverApplicationId));

    await logAdminActivity({
      entityType: "driver_application",
      entityId: params.driverApplicationId,
      action: "LINK_SENT",
      adminEmail: params.adminEmail ?? null,
      meta: { expiresAt: expiresAt.toISOString(), sendCount: 1 },
    });
  }

  return { success: true, expiresAt };
}

export async function getDriverOnboardingTokenRow(rawToken: string) {
  const tokenHash = sha256(rawToken);

  const rows = await db
    .select()
    .from(schema.driverOnboardingTokens)
    .where(eq(schema.driverOnboardingTokens.tokenHash, tokenHash))
    .limit(1);

  return (rows as any[])[0] ?? null;
}

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

export async function getDriverOnboardingByToken(rawToken: string) {
  const res = await checkDriverOnboardingToken(rawToken);
  if (!res.ok) return null;
  return res.row;
}

export async function markDriverOnboardingTokenUsed(rawToken: string) {
  const tokenHash = sha256(rawToken);

  await db
    .update(schema.driverOnboardingTokens)
    .set({ usedAt: new Date() } as any)
    .where(eq(schema.driverOnboardingTokens.tokenHash, tokenHash));
}

/**
 * Resend onboarding link (logs LINK_SENT)
 * NOTE: This creates a fresh token (revoking previous)
 */
export async function resendDriverOnboardingToken(params: {
  driverApplicationId: number;
  rawToken: string;
  expiresAt?: Date;
  adminEmail?: string | null;
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

  await db
    .update(schema.driverApplications)
    .set({
      status: "link_sent",
      lastTouchedAt: now,
      lastTouchedByEmail: params.adminEmail ?? null,
    } as any)
    .where(eq(schema.driverApplications.id, params.driverApplicationId));

  await logAdminActivity({
    entityType: "driver_application",
    entityId: params.driverApplicationId,
    action: "LINK_SENT",
    adminEmail: params.adminEmail ?? null,
    meta: { expiresAt: expiresAt.toISOString(), resend: true, sendCount: 1 },
  });

  return { success: true, expiresAt };
}

/**
 * ✅ Use this when you send a reminder (without issuing a new token),
 * so the timeline shows REMINDER_SENT instead of LINK_SENT.
 */
export async function logDriverOnboardingReminder(params: {
  driverApplicationId: number;
  adminEmail?: string | null;
  channel?: "email" | "sms" | "whatsapp" | "unknown";
}) {
  await touchDriverApplication({
    id: params.driverApplicationId,
    adminEmail: params.adminEmail ?? null,
  });

  await logAdminActivity({
    entityType: "driver_application",
    entityId: params.driverApplicationId,
    action: "REMINDER_SENT",
    adminEmail: params.adminEmail ?? null,
    meta: { channel: params.channel ?? "unknown" },
  });

  return { success: true };
}

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
  fileUrl: string; // ✅ should be STORAGE KEY (recommended) or stable URL
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

    await db
      .update(schema.driverApplications)
      .set({ status: "docs_received" } as any)
      .where(eq(schema.driverApplications.id, params.driverApplicationId));

    return { success: true };
  }

  await db.insert(schema.driverDocuments).values({
    driverApplicationId: params.driverApplicationId,
    type: params.type as any,
    fileUrl: params.fileUrl,
    expiryDate: params.expiryDate ?? null,
    status: "pending",
  } as any);

  await db
    .update(schema.driverApplications)
    .set({ status: "docs_received" } as any)
    .where(eq(schema.driverApplications.id, params.driverApplicationId));

  return { success: true };
}

export async function setDriverDocumentReview(params: {
  docId: number;
  status: "approved" | "rejected";
  reviewedBy: string;
  rejectionReason?: string | null;
  driverApplicationId?: number | null;
  docType?: DriverDocType | null;
}) {
  await db
    .update(schema.driverDocuments)
    .set({
      status: params.status,
      reviewedAt: new Date(),
      reviewedBy: params.reviewedBy,
      rejectionReason:
        params.status === "rejected"
          ? (params.rejectionReason ?? "Rejected")
          : null,
    } as any)
    .where(eq(schema.driverDocuments.id, params.docId));

  if (params.driverApplicationId) {
    await touchDriverApplication({
      id: Number(params.driverApplicationId),
      adminEmail: params.reviewedBy ?? null,
    });

    await logAdminActivity({
      entityType: "driver_application",
      entityId: Number(params.driverApplicationId),
      action: "DOC_REVIEWED",
      adminEmail: params.reviewedBy ?? null,
      meta: {
        docId: params.docId,
        type: params.docType ?? null,
        status: params.status,
        rejectionReason: params.rejectionReason ?? null,
      },
    });
  }
}

export async function getDriverDocumentByAppAndType(params: {
  driverApplicationId: number;
  type: DriverDocType;
}) {
  const rows = await db
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
    )
    .limit(1);

  return (rows as any[])[0] ?? null;
}

export async function reviewDriverDocumentByAppAndType(params: {
  driverApplicationId: number;
  type: DriverDocType;
  status: "approved" | "rejected";
  reviewedBy: string;
  rejectionReason?: string | null;
}) {
  const doc: any = await getDriverDocumentByAppAndType({
    driverApplicationId: params.driverApplicationId,
    type: params.type,
  });

  if (!doc) {
    throw new Error(
      `Document not found for driverApplicationId=${params.driverApplicationId}, type=${params.type}`
    );
  }

  await setDriverDocumentReview({
    docId: Number(doc.id),
    status: params.status,
    reviewedBy: params.reviewedBy,
    rejectionReason: params.rejectionReason ?? null,
    driverApplicationId: params.driverApplicationId,
    docType: params.type,
  });

  return getDriverDocumentByAppAndType({
    driverApplicationId: params.driverApplicationId,
    type: params.type,
  });
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

  const activity = await getAdminActivityForEntity({
    entityType: "driver_application",
    entityId: driverApplicationId,
    limit: 50,
  });

  return {
    driverApplication: app ?? null,
    driver: app ?? null,
    application: app ?? null,
    vehicle: vehicle ?? null,
    documents,
    activity,
  };
}

// ============================================================================
// ✅ Auto reminder helpers: link_sent + older than X days + zero docs
// ============================================================================

export type AutoReminderCandidate = {
  id: number;
  fullName: string | null;
  email: string;
  createdAt: Date | null;
};

export async function getOnboardingReminderCandidates(params?: {
  days?: number;
  limit?: number;
}) {
  const days = Math.max(1, Number(params?.days ?? 7));
  const limit = Math.max(1, Math.min(Number(params?.limit ?? 50), 200));

  const result: any = await db.execute(sql`
    SELECT
      da.id,
      da.fullName,
      da.email,
      da.createdAt
    FROM driver_applications da
    LEFT JOIN driver_documents dd
      ON dd.driverApplicationId = da.id
    WHERE
      da.status = 'link_sent'
      AND da.createdAt <= (NOW() - INTERVAL ${days} DAY)
      AND dd.id IS NULL
      AND NOT EXISTS (
        SELECT 1
        FROM admin_activity aa
        WHERE
          aa.entityType = 'driver_application'
          AND aa.entityId = da.id
          AND aa.action = 'REMINDER_SENT'
          AND aa.meta LIKE '%"auto":true%'
      )
    ORDER BY da.createdAt ASC
    LIMIT ${limit};
  `);

  const rows: any[] = Array.isArray(result)
    ? result
    : (result?.rows ?? result?.[0] ?? []);

  return rows.map((r) => ({
    id: Number(r.id),
    fullName: r.fullName ?? null,
    email: String(r.email),
    createdAt: r.createdAt ? new Date(r.createdAt) : null,
  })) as AutoReminderCandidate[];
}

export async function logAutoOnboardingReminder(params: {
  driverApplicationId: number;
  adminEmail?: string | null;
  days?: number;
}) {
  const days = Math.max(1, Number(params.days ?? 7));

  await db
    .update(schema.driverApplications)
    .set({
      lastTouchedAt: new Date(),
      lastTouchedByEmail: params.adminEmail ?? "system",
    } as any)
    .where(eq(schema.driverApplications.id, Number(params.driverApplicationId)));

  await logAdminActivity({
    entityType: "driver_application",
    entityId: Number(params.driverApplicationId),
    action: "REMINDER_SENT",
    adminEmail: params.adminEmail ?? "system",
    meta: { auto: true, days },
  });

  return { success: true };
}
