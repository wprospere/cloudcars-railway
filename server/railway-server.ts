import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";

import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "./routers.js";
import { createContext } from "./railway-trpc.js";
import { ensureDefaultAdmin } from "./auth/ensureAdmin.js";
import { adminRoutes } from "./auth/adminRoutes.js";

// ✅ DB helpers (same ones admin/tRPC uses)
import {
  createCorporateInquiry,
  createDriverApplication,
  getAllDriverApplications,
  getAllCorporateInquiries,
  getAllContactMessages,
} from "./db";

// ✅ migrations live in PROJECT ROOT
import { runMigrations } from "./db";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Force lowercase admin URLs
app.use((req, res, next) => {
  if (/^\/admin/i.test(req.path)) {
    const lower = req.path.toLowerCase();
    if (req.path !== lower) return res.redirect(301, lower);
  }
  next();
});

// ✅ Redirect apex -> www (GET/HEAD only)
app.use((req, res, next) => {
  const host = (req.headers.host || "").toLowerCase();
  if (
    (req.method === "GET" || req.method === "HEAD") &&
    host === "cloudcarsltd.com"
  ) {
    return res.redirect(301, `https://www.cloudcarsltd.com${req.originalUrl}`);
  }
  next();
});

// Health check
app.get("/healthz", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

// --------------------
// API routes
// --------------------

// ✅ IMPORTANT: Your frontend calls /api/admin/login (seen in DevTools)
// So mount adminRoutes here:
app.use("/api/admin", adminRoutes);

// ✅ Keep /admin working too, but only for non-GET/HEAD actions
// (GET /admin/login should be handled by your React SPA)
app.use("/admin", (req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD") return next();
  return (adminRoutes as any)(req, res, next);
});

// ✅ IMPORTANT: Your frontend is likely configured for /api/trpc
// Mount tRPC on BOTH paths to avoid HTML (index.html) being returned.
app.use(
  ["/trpc", "/api/trpc"],
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, path }) {
      console.error("tRPC error on path:", path, error);
    },
  })
);

// Example public form endpoints (if you use them)
app.post("/api/driver-apply", async (req, res) => {
  try {
    const result = await createDriverApplication(req.body);
    res.json({ ok: true, result });
  } catch (e: any) {
    console.error("createDriverApplication failed:", e?.message || e);
    res
      .status(500)
      .json({ ok: false, error: "Failed to submit driver application" });
  }
});

app.post("/api/corporate-inquiry", async (req, res) => {
  try {
    const result = await createCorporateInquiry(req.body);
    res.json({ ok: true, result });
  } catch (e: any) {
    console.error("createCorporateInquiry failed:", e?.message || e);
    res
      .status(500)
      .json({ ok: false, error: "Failed to submit corporate inquiry" });
  }
});

// Admin exports (if your UI calls these)
app.get("/api/admin/driver-applications", async (_req, res) => {
  try {
    const rows = await getAllDriverApplications();
    res.json({ ok: true, rows });
  } catch (e: any) {
    console.error("getAllDriverApplications failed:", e?.message || e);
    res
      .status(500)
      .json({ ok: false, error: "Failed to load driver applications" });
  }
});

app.get("/api/admin/corporate-inquiries", async (_req, res) => {
  try {
    const rows = await getAllCorporateInquiries();
    res.json({ ok: true, rows });
  } catch (e: any) {
    console.error("getAllCorporateInquiries failed:", e?.message || e);
    res
      .status(500)
      .json({ ok: false, error: "Failed to load corporate inquiries" });
  }
});

app.get("/api/admin/contact-messages", async (_req, res) => {
  try {
    const rows = await getAllContactMessages();
    res.json({ ok: true, rows });
  } catch (e: any) {
    console.error("getAllContactMessages failed:", e?.message || e);
    res
      .status(500)
      .json({ ok: false, error: "Failed to load contact messages" });
  }
});

// --------------------
// Static / SPA
// --------------------
// Railway build output: /dist/public
const clientDist = path.join(process.cwd(), "dist", "public");
app.use(express.static(clientDist));

// SPA fallback (keep LAST)
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// --------------------
// Startup
// --------------------

function shouldRunMigrations() {
  return String(process.env.RUN_MIGRATIONS || "").toLowerCase() === "true";
}

function drizzleJournalExists() {
  const journalPath = path.join(process.cwd(), "drizzle", "meta", "_journal.json");
  return fs.existsSync(journalPath);
}

async function safeRunMigrations() {
  if (!shouldRunMigrations()) {
    console.log("ℹ️ RUN_MIGRATIONS is not true — skipping migrations");
    return;
  }

  if (!drizzleJournalExists()) {
    console.warn("⚠️ Skipping migrations: drizzle/meta/_journal.json missing in container");
    return;
  }

  try {
    console.log("🛠️ Running drizzle migrations from: /app/drizzle/migrations");
    await runMigrations();
    console.log("✅ Migrations complete");
  } catch (e: any) {
    console.error("❌ runMigrations failed:", e?.message || e);
  }
}

(async () => {
  await safeRunMigrations();

  try {
    await ensureDefaultAdmin();
  } catch (e: any) {
    console.error("ensureDefaultAdmin failed:", e?.message || e);
  }

  app.listen(PORT, () => {
    console.log(`✅ Cloud Cars server running on port ${PORT}`);
  });
})();
