import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import superjson from "superjson";

import { appRouter } from "./routers.js";
import { createContext } from "./railway-trpc.js";
import { ensureDefaultAdmin } from "./auth/ensureAdmin.js";
import { adminRoutes } from "./auth/adminRoutes.js";

// ✅ DB helpers (same ones admin/tRPC uses)
import {
  runMigrations,
  createCorporateInquiry,
  createDriverApplication,
  getAllDriverApplications,
  getAllCorporateInquiries,
  getAllContactMessages,
} from "./db";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// Railway / reverse proxy
app.set("trust proxy", 1);

// Redirect apex -> www (GET/HEAD only)
app.use((req, res, next) => {
  const host = (req.headers.host || "").toLowerCase();
  if (
    (req.method === "GET" || req.method === "HEAD") &&
    host === "cloudcarsltd.com"
  ) {
    return res.redirect(301, "https://www.cloudcarsltd.com" + req.originalUrl);
  }
  next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Force lowercase admin URLs
app.use((req, res, next) => {
  if (/^\/admin/i.test(req.path) || /^\/api\/admin/i.test(req.path)) {
    const lower = req.originalUrl.toLowerCase();
    if (lower !== req.originalUrl) return res.redirect(301, lower);
  }
  next();
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ Debug endpoint: confirms what the DB actually contains
app.get("/api/debug/counts", async (_req, res) => {
  try {
    const [drivers, corporate, contact] = await Promise.all([
      getAllDriverApplications(),
      getAllCorporateInquiries(),
      getAllContactMessages(),
    ]);

    return res.json({
      ok: true,
      drivers: drivers.length,
      corporate: corporate.length,
      contact: contact.length,
    });
  } catch (err: any) {
    console.error("❌ /api/debug/counts error:", err?.message || err);
    return res
      .status(500)
      .json({ ok: false, message: err?.message || "error" });
  }
});

/**
 * ✅ PUBLIC: Corporate inquiry -> SAVES TO DB
 */
app.post("/api/corporate-inquiry", async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      estimatedMonthlyTrips,
      requirements,
    } = req.body ?? {};

    if (!companyName || !contactName || !email || !phone) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    const result = await createCorporateInquiry({
      companyName,
      contactName,
      email,
      phone,
      estimatedMonthlyTrips: estimatedMonthlyTrips || null,
      requirements: requirements || null,
      internalNotes: null,
      assignedTo: null,
    } as any);

    console.log("✅ Corporate inquiry saved:", result);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("❌ /api/corporate-inquiry error:", err?.message || err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * ✅ PUBLIC: Driver application -> SAVES TO DB
 */
app.post("/api/driver-application", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      licenseNumber,
      yearsExperience,
      vehicleOwner,
      vehicleType,
      availability,
      message,
    } = req.body ?? {};

    if (
      !fullName ||
      !email ||
      !phone ||
      !licenseNumber ||
      availability == null
    ) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    const result = await createDriverApplication({
      fullName,
      email,
      phone,
      licenseNumber,
      yearsExperience: Number(yearsExperience ?? 0),
      vehicleOwner: Boolean(vehicleOwner),
      vehicleType: vehicleType || null,
      availability,
      message: message || null,
      internalNotes: null,
      assignedTo: null,
    } as any);

    console.log("✅ Driver application saved:", result);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("❌ /api/driver-application error:", err?.message || err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Admin auth routes
app.use("/api/admin", adminRoutes);

// tRPC routes (superjson must match client)
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    transformer: superjson,
  })
);

// Block unknown API routes
app.all("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Frontend
const publicPath = path.resolve(process.cwd(), "dist", "public");

app.use(
  express.static(publicPath, {
    index: false,
    maxAge: "1y",
    immutable: true,
  })
);

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  return res.sendFile(path.join(publicPath, "index.html"));
});

// Error handling
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Startup
async function start() {
  // ✅ Run migrations first (so tables/columns exist before any queries)
  try {
    await runMigrations();
  } catch (err: any) {
    console.error("❌ runMigrations failed:", err?.message || err);
    // If you prefer to hard-fail deploy when migrations fail, uncomment:
    // throw err;
  }

  try {
    await ensureDefaultAdmin();
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (msg.includes("admin_users") && msg.includes("doesn't exist")) {
      console.warn(
        "⚠️ admin_users table missing. Drizzle migrations may not have run."
      );
    } else {
      console.error("❌ ensureDefaultAdmin failed:", err);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Cloud Cars server running on port ${PORT}`);
  });
}

start();
