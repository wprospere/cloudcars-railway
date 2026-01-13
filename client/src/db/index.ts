/**
 * Railway LIVE ONLY database bootstrap.
 * - Requires DATABASE_URL
 * - Single pool for the whole app
 * - Optional ping helper for health checks
 *
 * ⚠️ IMPORTANT:
 * This file is imported by the CLIENT build.
 * Therefore we must use TYPE-ONLY imports for drizzle schema
 * to avoid bundling server-only code into the browser.
 */

import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// ✅ TYPE-ONLY import + correct relative path
import type * as schema from "../../../drizzle/schema";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// ✅ Railway standard
const DATABASE_URL = requiredEnv("DATABASE_URL");

// ✅ Pool (stable for Railway + long-lived connections)
export const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
});

// ✅ Drizzle instance (schema used only for typing)
export const db = drizzle(pool, { schema: schema as any, mode: "default" });

// ✅ Simple health-check helper
export async function dbPing() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}
