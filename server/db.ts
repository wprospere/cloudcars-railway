/**
 * Database query helpers (Railway-safe)
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, asc, desc } from "drizzle-orm";
import * as schema from "../drizzle/schema";

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
 * Helper: get insertId reliably across mysql2/drizzle versions
 */
async function insertAndReturnId<T>(q: Promise<T>): Promise<{ id: number }> {
  const res: any = await q;
  const id =
    res?.[0]?.insertId ??
    res?.insertId ??
    res?.[0]?.id ??
    res?.id;

  if (!id) {
    // If drizzle returns OkPacket-like but no insertId, surface it
    throw new Error(`Insert succeeded but no insertId returned: ${JSON.stringify(res)}`);
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

export async function getAllDriverApplications() {
  return db.query.driverApplications.findMany({
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
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
  // Your schema.ts in this chat does NOT show displayOrder, so order by id
  // If you actually have displayOrder in DB/schema, we can switch back.
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
  await db.update(schema.teamMembers).set(data as any).where(eq(schema.teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
}

// -------------------- Site Content (CMS) --------------------

export async function getSiteContent(sectionKey: string) {
  // IMPORTANT: your schema uses sectionKey, not "key"
  return db.query.siteContent.findFirst({
    where: (content, { eq }) => eq(content.sectionKey, sectionKey),
  });
}

export async function getAllSiteContent() {
  return db.query.siteContent.findMany({
    orderBy: (c, { asc }) => [asc(c.sectionKey)],
  });
}

/**
 * Upsert CMS content by sectionKey
 * Router expects upsertSiteContent({ sectionKey, title, subtitle, ... })
 */
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
  // IMPORTANT: your schema uses imageKey, not "key"
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
 * Upsert CMS image record by imageKey
 * Router expects upsertSiteImage({ imageKey, url, altText, caption })
 */
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
