import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { adminUsers } from "../../drizzle/schema.js";
import { verifyPassword } from "./password.js";
import {
  clearAdminCookie,
  readAdminIdFromCookie,
  setAdminCookie,
} from "./session.js";

export const adminRoutes = express.Router();

adminRoutes.post("/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  const admin = rows[0];
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  setAdminCookie(res, admin.id);

  return res.json({
    ok: true,
    admin: { id: admin.id, email: admin.email, role: admin.role },
  });
});

adminRoutes.post("/logout", (_req, res) => {
  clearAdminCookie(res);
  return res.json({ ok: true });
});

adminRoutes.get("/me", async (req, res) => {
  const adminId = readAdminIdFromCookie(req);
  if (!adminId) return res.status(401).json({ error: "Not authenticated" });

  const rows = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, adminId))
    .limit(1);

  const admin = rows[0];
  if (!admin) return res.status(401).json({ error: "Not authenticated" });

  return res.json({ ok: true, admin });
});
