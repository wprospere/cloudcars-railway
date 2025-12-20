/**
 * Database query helpers
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema";

// Create MySQL connection pool
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle({ client: connection, schema, mode: "default" });

// Export schema for use in queries
export { schema };

// Bookings
export async function createBooking(data: typeof schema.bookings.$inferInsert) {
  const [result] = await db.insert(schema.bookings).values(data);
  return result;
}

// Driver Applications
export async function createDriverApplication(data: typeof schema.driverApplications.$inferInsert) {
  const [result] = await db.insert(schema.driverApplications).values(data);
  return result;
}

export async function getAllDriverApplications() {
  return db.query.driverApplications.findMany({
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
}

export async function updateDriverApplicationStatus(id: number, status: string) {
  await db.update(schema.driverApplications)
    .set({ status })
    .where(eq(schema.driverApplications.id, id));
}

export async function updateDriverApplicationNotes(id: number, notes: string) {
  await db.update(schema.driverApplications)
    .set({ notes })
    .where(eq(schema.driverApplications.id, id));
}

export async function updateDriverApplicationAssignment(id: number, assignedTo: string | null) {
  await db.update(schema.driverApplications)
    .set({ assignedTo })
    .where(eq(schema.driverApplications.id, id));
}

// Corporate Inquiries
export async function createCorporateInquiry(data: typeof schema.corporateInquiries.$inferInsert) {
  const [result] = await db.insert(schema.corporateInquiries).values(data);
  return result;
}

export async function getAllCorporateInquiries() {
  return db.query.corporateInquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
  });
}

export async function updateCorporateInquiryStatus(id: number, status: string) {
  await db.update(schema.corporateInquiries)
    .set({ status })
    .where(eq(schema.corporateInquiries.id, id));
}

export async function updateCorporateInquiryNotes(id: number, notes: string) {
  await db.update(schema.corporateInquiries)
    .set({ notes })
    .where(eq(schema.corporateInquiries.id, id));
}

export async function updateCorporateInquiryAssignment(id: number, assignedTo: string | null) {
  await db.update(schema.corporateInquiries)
    .set({ assignedTo })
    .where(eq(schema.corporateInquiries.id, id));
}

// Contact Messages
export async function createContactMessage(data: typeof schema.contactMessages.$inferInsert) {
  const [result] = await db.insert(schema.contactMessages).values(data);
  return result;
}

export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
}

export async function updateContactMessageStatus(id: number, status: string) {
  await db.update(schema.contactMessages)
    .set({ status })
    .where(eq(schema.contactMessages.id, id));
}

export async function updateContactMessageNotes(id: number, notes: string) {
  await db.update(schema.contactMessages)
    .set({ notes })
    .where(eq(schema.contactMessages.id, id));
}

export async function markContactMessageAsRead(id: number) {
  await db.update(schema.contactMessages)
    .set({ status: 'read' })
    .where(eq(schema.contactMessages.id, id));
}

export async function updateContactMessageAssignment(id: number, assignedTo: string | null) {
  await db.update(schema.contactMessages)
    .set({ assignedTo })
    .where(eq(schema.contactMessages.id, id));
}

// Team Members
export async function getAllTeamMembers() {
  return db.query.teamMembers.findMany({
    orderBy: (members, { asc }) => [asc(members.displayOrder)],
  });
}

export async function createTeamMember(data: typeof schema.teamMembers.$inferInsert) {
  const [result] = await db.insert(schema.teamMembers).values(data);
  return result;
}

export async function updateTeamMember(id: number, data: Partial<typeof schema.teamMembers.$inferInsert>) {
  await db.update(schema.teamMembers)
    .set(data)
    .where(eq(schema.teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  await db.delete(schema.teamMembers)
    .where(eq(schema.teamMembers.id, id));
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
    await db.update(schema.siteContent)
      .set({ value, updatedAt: new Date() })
      .where(eq(schema.siteContent.key, key));
  } else {
    await db.insert(schema.siteContent).values({ key, value });
  }
}

// Site Images (CMS)
export async function getAllSiteImages() {
  return db.query.siteImages.findMany();
}

export async function createSiteImage(data: typeof schema.siteImages.$inferInsert) {
  const [result] = await db.insert(schema.siteImages).values(data);
  return result;
}

export async function updateSiteImage(id: number, data: Partial<typeof schema.siteImages.$inferInsert>) {
  await db.update(schema.siteImages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.siteImages.id, id));
}

export async function deleteSiteImage(id: number) {
  await db.delete(schema.siteImages)
    .where(eq(schema.siteImages.id, id));
}
