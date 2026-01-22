import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";

import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import mysql from "mysql2/promise";

import { appRouter } from "./routers.js";
import { createContext } from "./railway-trpc.js";
import { adminRoutes } from "./auth/adminRoutes.js";
import { ensureDefaultAdmin } from "./auth/ensureAdmin.js";

// ✅ DB helpers (same ones admin/tRPC uses)
import {
  createCorporateInquiry,
  createDriverApplication,
  getAllDriverApplications,
  getAllCorporateInquiries,
  getAllContactMessages,
  runMigrations,
} from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// Railway / reverse proxy
app.set("trust proxy", 1);

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

/**
 * ✅ IMPORTANT:
 * Previously you forced apex -> www.
 * But your "www.cloudcarsltd.com" is not attached in Railway, so that redirect
 * caused the homepage to show "Not Found".
 *
 * For now: DO NOT redirect apex -> www.
 *
 * If you later add www as a Railway domain, you can re-enable a safe redirect:
 *
 * app.use((req, res, next) => {
 *   const host = String(req.headers.host || "").toLowerCase().split(":")[0];
 *   if ((req.method === "GET" || req.method === "HEAD") && host === "cloudcarsltd.com") {
 *     return res.redirect(301, `https://www.cloudcarsltd.com${req.originalUrl}`);
 *   }
 *   next();
 * });
 */

// --------------------
// Paths (must be defined BEFORE debug/static routes)
// --------------------

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ✅ Split build layout:
 *   - server bundle: dist/server/railway-server.js
 *   - client build : dist/client
 *
 * This file runs from dist/server at runtime, so client is ../client.
 */
const clientDist = path.resolve(__dirname, "../client");

/**
 * (Optional TEMP) Local uploads folder for CMS images stored as /uploads/...
 * ⚠️ Railway disk is ephemeral — move uploads to S3 for production durability.
 */
const uploadsDir = path.resolve(process.cwd(), "uploads");

// --------------------
// Health + Debug
// --------------------

// Health check
app.get("/healthz", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

// ✅ Expanded debug route – lists runtime filesystem contents
app.get("/__debug", (_req, res) => {
  const distPath = path.join(process.cwd(), "dist");
  const clientPath = path.join(distPath, "client");
  const indexPath = path.join(clientPath, "index.html");

  const safeList = (p: string) => {
    try {
      return fs.readdirSync(p).slice(0, 200);
    } catch {
      return null;
    }
  };

  res.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),

    // what the server THINKS it's serving from
    clientDist,

    // what's actually on disk in the running container
    distPath,
    distList: safeList(distPath),

    clientPath,
    clientList: safeList(clientPath),

    indexPath,
    indexExists: fs.existsSync(indexPath),
  });
});

// --------------------
// API routes
// --------------------

// ✅ IMPORTANT: Your frontend calls /api/admin/login
app.use("/api/admin", adminRoutes);

// ✅ Keep /admin working too, but only for non-GET/HEAD actions
app.use("/admin", (req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD") return next();
  return (adminRoutes as any)(req, res, next);
});

// ✅ Mount tRPC on BOTH paths
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

// Example public form endpoints (optional)
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

// Admin exports (optional)
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
// CMS image upload -> S3 (recommended)
// --------------------

// In-memory upload (no disk)
const upload = multer({ storage: multer.memoryStorage() });

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// Only create S3 client when env is present (prevents boot crash if not configured yet)
function isS3Configured() {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET
  );
}

const s3 = isS3Configured()
  ? new S3Client({
      region: requiredEnv("AWS_REGION"),
      credentials: {
        accessKeyId: requiredEnv("AWS_ACCESS_KEY_ID"),
        secretAccessKey: requiredEnv("AWS_SECRET_ACCESS_KEY"),
      },
    })
  : null;

const S3_BUCKET = isS3Configured() ? process.env.AWS_S3_BUCKET! : "";
const S3_PUBLIC_BASE = isS3Configured()
  ? process.env.AWS_S3_PUBLIC_BASE ||
    `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
  : "";

// Upload endpoint (you can wrap with your admin auth later)
app.post("/api/admin/cms-upload", upload.single("file"), async (req, res) => {
  try {
    if (!isS3Configured() || !s3) {
      return res.status(500).json({
        ok: false,
        error:
          "S3 is not configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET",
      });
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    const ext = (req.file.originalname.split(".").pop() || "bin").toLowerCase();
    const key = `cms/${new Date().toISOString().slice(0, 10)}/${nanoid()}.${ext}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read", // public images
      })
    );

    const url = `${S3_PUBLIC_BASE}/${key}`;
    return res.json({ ok: true, key, url });
  } catch (e: any) {
    console.error("cms-upload failed:", e?.message || e);
    return res.status(500).json({ ok: false, error: "Upload failed" });
  }
});

// --------------------
// Static / SPA
// --------------------

// ✅ Serve uploads FIRST so SPA fallback never intercepts image URLs
app.use("/uploads", express.static(uploadsDir));

// ✅ Serve built frontend (Vite output)
app.use(express.static(clientDist));

// ✅ Force homepage to always be the React app
app.get("/", (_req, res) => {
  return res.sendFile(path.join(clientDist, "index.html"));
});

// ✅ SPA fallback (keep LAST) — but don't break API/tRPC routes
app.get("*", (req, res) => {
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/trpc") ||
    req.path.startsWith("/uploads") ||
    req.path === "/healthz" ||
    req.path === "/__debug"
  ) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  return res.sendFile(path.join(clientDist, "index.html"));
});

// --------------------
// Startup helpers
// --------------------
function shouldRunMigrations() {
  return String(process.env.RUN_MIGRATIONS || "").toLowerCase() === "true";
}

function drizzleJournalExists() {
  const journalPath = path.join(
    process.cwd(),
    "drizzle",
    "meta",
    "_journal.json"
  );
  return fs.existsSync(journalPath);
}

function getDatabaseUrl(): string | undefined {
  // Your db.ts REQUIRES DATABASE_URL, but patcher can accept common variants too
  return (
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    process.env.MYSQLDATABASE_URL ||
    process.env.DATABASE_PRIVATE_URL
  );
}

/**
 * ✅ DB patcher: fixes missing columns without running SQL manually.
 * Safe to run on every boot (idempotent).
 */
async function patchDatabaseIfNeeded() {
  const DATABASE_URL = getDatabaseUrl();

  if (!DATABASE_URL) {
    console.warn(
      "⚠️ DB patch skipped: no DATABASE_URL / MYSQL_URL / MYSQLDATABASE_URL / DATABASE_PRIVATE_URL found"
    );
    return;
  }

  let pool: mysql.Pool | null = null;

  const hasColumn = async (table: string, column: string) => {
    if (!pool) throw new Error("DB pool not initialised");

    const [rows] = await pool.query<any[]>(
      `
      SELECT COUNT(*) AS cnt
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      `,
      [table, column]
    );

    return Number(rows?.[0]?.cnt ?? 0) > 0;
  };

  try {
    pool = mysql.createPool({
      uri: DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    const table = "driver_onboarding_tokens";

    if (!(await hasColumn(table, "revokedAt"))) {
      console.log(`🛠️ DB patch: adding ${table}.revokedAt ...`);
      await pool.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`revokedAt\` DATETIME NULL`
      );
      console.log(`✅ DB patch: added ${table}.revokedAt`);
    }

    if (!(await hasColumn(table, "lastSentAt"))) {
      console.log(`🛠️ DB patch: adding ${table}.lastSentAt ...`);
      await pool.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`lastSentAt\` DATETIME NULL`
      );
      console.log(`✅ DB patch: added ${table}.lastSentAt`);
    }

    if (!(await hasColumn(table, "sendCount"))) {
      console.log(`🛠️ DB patch: adding ${table}.sendCount ...`);
      await pool.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`sendCount\` INT NOT NULL DEFAULT 0`
      );
      console.log(`✅ DB patch: added ${table}.sendCount`);
    }
  } catch (e: any) {
    console.error("❌ DB patch failed:", e?.message || e);
  } finally {
    try {
      await pool?.end();
    } catch {
      // ignore
    }
  }
}

async function safeRunMigrations() {
  if (!shouldRunMigrations()) {
    console.log("ℹ️ RUN_MIGRATIONS is not true — skipping migrations");
    return;
  }

  if (!drizzleJournalExists()) {
    console.warn(
      "⚠️ Skipping migrations: drizzle/meta/_journal.json missing in container"
    );
    return;
  }

  try {
    console.log("🛠️ Running drizzle migrations...");
    await runMigrations();
    console.log("✅ Migrations complete");
  } catch (e: any) {
    console.error("❌ runMigrations failed:", e?.message || e);
  }
}

// --------------------
// Startup
// --------------------
async function bootstrap() {
  // ✅ Patch DB first so endpoints don't crash if a column is missing
  await patchDatabaseIfNeeded();

  // ✅ Migrations (opt-in via env)
  await safeRunMigrations();

  // ✅ Ensure admin exists
  try {
    await ensureDefaultAdmin();
  } catch (e: any) {
    console.error("ensureDefaultAdmin failed:", e?.message || e);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Cloud Cars server running on port ${PORT}`);
    console.log(`📦 Serving client from: ${clientDist}`);
    console.log(`🖼️ Serving uploads from: ${uploadsDir}`);
    if (!isS3Configured()) {
      console.log(
        "ℹ️ S3 not configured yet (CMS upload disabled until AWS_* env vars are set)."
      );
    }
  });
}

bootstrap().catch((err) => {
  console.error("❌ Bootstrap failed", err);
  process.exit(1);
});
