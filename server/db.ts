/**
 * Database query helpers (Railway-safe)
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, asc } from "drizzle-orm";
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

// -------------------- Helpers --------------------

// Bookings
export async function createBooking(data: typeof schema.bookings.$inferInsert) {
  return db.insert(schema.bookings).values(data);
}

// Driver Applications
export async function createDriverApplication(
  data: typeof schema.driverApplications.$inferInsert
) {
  return db.insert(schema.driverApplications).values(data);
}

export async function getAllDriverApplications() {
  return db.query.driverApplications.findMany({
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
}

export async function updateDriverApplicationStatus(id: number, status: string) {
  await db
    .update(schema.driverApplications)
    .set({ status } as any)
    .where(eq(schema.driverApplications.id, id));
}

export async function updateDriverApplicationNotes(id: number, notes: string) {
  await db
    .update(schema.driverApplications)
    .set({ notes } as any)
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

// Corporate Inquiries
export async function createCorporateInquiry(
  data: typeof schema.corporateInquiries.$inferInsert
) {
  return db.insert(schema.corporateInquiries).values(data);
}

export async function getAllCorporateInquiries() {
  return db.query.corporateInquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
  });
}

export async function updateCorporateInquiryStatus(id: number, status: string) {
  await db
    .update(schema.corporateInquiries)
    .set({ status } as any)
    .where(eq(schema.corporateInquiries.id, id));
}

export async function updateCorporateInquiryNotes(id: number, notes: string) {
  await db
    .update(schema.corporateInquiries)
    .set({ notes } as any)
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

// Contact Messages
export async function createContactMessage(
  data: typeof schema.contactMessages.$inferInsert
) {
  return db.insert(schema.contactMessages).values(data);
}

export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
}

export async function updateContactMessageStatus(id: number, status: string) {
  await db
    .update(schema.contactMessages)
    .set({ status } as any)
    .where(eq(schema.contactMessages.id, id));
}

export async function updateContactMessageNotes(id: number, notes: string) {
  await db
    .update(schema.contactMessages)
    .set({ notes } as any)
    .where(eq(schema.contactMessages.id, id));
}

export async function markContactMessageAsRead(id: number) {
  await db
    .update(schema.contactMessages)
    .set({ status: "read" } as any)
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

// Team Members
export async function getAllTeamMembers() {
  return db.query.teamMembers.findMany({
    orderBy: (members) => [asc(members.displayOrder)],
  });
}

export async function createTeamMember(
  data: typeof schema.teamMembers.$inferInsert
) {
  return db.insert(schema.teamMembers).values(data);
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

// Site Content (CMS)
export async function getSiteContent(key: string) {
  return db.query.siteContent.findFirst({
    where: (content, { eq }) => eq(content.key, key),
  });
}

export async function getAllSiteContent() {
  return db.query.siteContent.findMany();
}

export async function updateSiteContent(key: string, value: string) {
  const existing = await getSiteContent(key);
  if (existing) {
    await db
      .update(schema.siteContent)
      .set({ value, updatedAt: new Date() } as any)
      .where(eq(schema.siteContent.key, key));
  } else {
    await db.insert(schema.siteContent).values({ key, value } as any);
  }
}

export async function upsertSiteContent(key: string, value: string) {
  return updateSiteContent(key, value);
}

// Site Images (CMS)
export async function getSiteImage(key: string) {
  return db.query.siteImages.findFirst({
    where: (image, { eq }) => eq(image.key, key),
  });
}

export async function getAllSiteImages() {
  return db.query.siteImages.findMany();
}

export async function createSiteImage(
  data: typeof schema.siteImages.$inferInsert
) {
  return db.insert(schema.siteImages).values(data);
}

export async function updateSiteImage(
  id: number,
  data: Partial<typeof schema.siteImages.$inferInsert>
) {
  await db
    .update(schema.siteImages)
    .set({ ...data, updatedAt: new Date() } as any)
    .where(eq(schema.siteImages.id, id));
}

export async function upsertSiteImage(key: string, url: string, alt?: string) {
  const existing = await getSiteImage(key);

  if (existing) {
    await db
      .update(schema.siteImages)
      .set({ url, alt: alt || existing.alt, updatedAt: new Date() } as any)
      .where(eq(schema.siteImages.key, key));
    return existing.id;
  } else {
    const result: any = await db.insert(schema.siteImages).values({
      key,
      url,
      alt: alt || key,
    } as any);

    return result?.[0]?.insertId ?? result?.insertId ?? null;
  }
}

export async function deleteSiteImage(id: number) {
  await db.delete(schema.siteImages).where(eq(schema.siteImages.id, id));
}
