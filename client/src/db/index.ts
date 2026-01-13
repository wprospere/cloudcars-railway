/**
 * Railway LIVE ONLY database bootstrap.
 * - Requires DATABASE_URL
 * - Single pool for the whole app
 * - Optional ping helper for health checks
 */

import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// ✅ Railway standard
const DATABASE_URL = requiredEnv("DATABASE_URL");

// ✅ Pool (keep it stable in serverless-ish deploys too)
export const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
});

export const db = drizzle(pool, { schema, mode: "default" });

export async function dbPing() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}
