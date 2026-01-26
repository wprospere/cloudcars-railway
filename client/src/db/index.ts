// client/src/db/index.ts  (or server/src/db/index.ts)
import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// ✅ Export pool so migrate.ts can import it
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // optional but nice:
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 10),
  queueLimit: 0,
});

// ✅ Drizzle DB from the pool
export const db = drizzle(pool);
