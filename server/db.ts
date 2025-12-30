/**
 * Database query helpers (Railway-safe)
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, asc } from "drizzle-orm";
import * as schema from "../drizzle/schema";

/**
 * Prefer DATABASE_URL (Railway standard).
 * Fallback to MYSQL* for other hosts.
 */
function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const DATABASE_URL = process.env.DATABASE_URL;

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

export const db = drizzle(pool, { schema, mode: "default" });
export { schema };

// -------------------- Helpers --------------------

// Bookings
export async function createBooking(data: typeof schema.bookings.$inferInsert) {
  const result = await db.insert(schema.bookings).values(data);
  return result;
}

// Driver Applications
export async function createDriverApplication(
  data: typeof schema.driverApplications.$inferInsert
) {
  const result = await db.insert(schema.driverApplications).values(data);
  return result;
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
  const result = await db.insert(schema.corporateInquiries).values(data);
  return result;
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
  const result = await db.insert(schema.contactMessages).values(data);
  return result;
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
  const result = await db.insert(schema.teamMembers).values(data);
  return result;
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

export async function createSiteImage(data: typeof schema.siteImages.$inferInsert) {
  const result = await db.insert(schema.siteImages).values(data);
  return result;
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

    // return existing id (no new row)
    return existing.id;
  } else {
    const result: any = await db.insert(schema.siteImages).values({
      key,
      url,
      alt: alt || key,
    } as any);

    // drizzle/mysql2 insert return varies by version; keep it flexible:
    return result?.[0]?.insertId ?? result?.insertId ?? null;
  }
}

export async function deleteSiteImage(id: number) {
  await db.delete(schema.siteImages).where(eq(schema.siteImages.id, id));
}
