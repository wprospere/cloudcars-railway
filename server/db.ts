/**
 * Database query helpers (Railway-safe)
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Prefer DATABASE_URL (Railway standard).
 * Fallback to MYSQL* for other hosts.
 */
const DATABASE_URL = process.env.DATABASE_URL;

const pool = DATABASE_URL
  ? mysql.createPool({
      uri: DATABASE_URL,
      // Railway + serverless-ish environments behave better with these:
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
