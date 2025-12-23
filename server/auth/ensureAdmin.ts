import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { adminUsers } from "../../drizzle/schema.js";
import { hashPassword } from "./password.js";

export async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping default admin bootstrap");
    return;
  }

  const existing = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log("✅ Admin user already exists:", email);
    return;
  }

  const passwordHash = await hashPassword(password);

  // id auto-increments, createdAt defaults to now (but setting it explicitly is fine too)
  await db.insert(adminUsers).values({
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date(),
  });

  console.log("✅ Default admin user created:", email);
}

