import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, pool } from "./index";
import path from "path";

let ran = false;

export async function runMigrationsOnce() {
  if (ran) return;
  ran = true;

  // migrations folder produced by drizzle-kit (committed to repo)
  const migrationsFolder = path.join(process.cwd(), "drizzle");

  await migrate(db, { migrationsFolder });

  // Optional: quick sanity ping afterwards
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }

  console.log("✅ Drizzle migrations applied");
}
