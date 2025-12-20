/**
 * Database query helpers
 *
 * Keep this file focused on raw queries and result mapping.
 * Business logic belongs in routers.ts procedures.
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

// Create MySQL connection pool
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle({ client: connection, schema, mode: "default" });

// Export schema for use in queries
export { schema };

// Example helper functions (add your own as needed)

/**
 * Get all driver applications
 */
export async function getAllDriverApplications() {
  return db.query.driverApplications.findMany({
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
}

/**
 * Get all corporate inquiries
 */
export async function getAllCorporateInquiries() {
  return db.query.corporateInquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
  });
}

/**
 * Get all contact messages
 */
export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
}

/**
 * Get all team members
 */
export async function getAllTeamMembers() {
  return db.query.teamMembers.findMany({
    orderBy: (members, { asc }) => [asc(members.displayOrder)],
  });
}
