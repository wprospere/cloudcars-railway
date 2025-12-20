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

export async function assignDriverApplication(id: number, assignedTo: string | null) {
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

export async function assignCorporateInquiry(id: number, assignedTo: string | null) {
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

export async function assignContactMessage(id: number, assignedTo: string | null) {
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
