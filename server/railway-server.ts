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

// ✅ DB helpers
import { createCorporateInquiry, createDriverApplication } from "./db";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// ----------------------------------------------------
// Railway / reverse proxy (REQUIRED for secure cookies)
// ----------------------------------------------------
app.set("trust proxy", 1);

// ----------------------------------------------------
// Redirect apex -> www (GET/HEAD only — safe for APIs)
// ----------------------------------------------------
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

// --------------------
// Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --------------------
// Force lowercase admin URLs (pages + API)
// --------------------
app.use((req, res, next) => {
  if (/^\/admin/i.test(req.path) || /^\/api\/admin/i.test(req.path)) {
    const lower = req.originalUrl.toLowerCase();
    if (lower !== req.originalUrl) {
      return res.redirect(301, lower);
    }
  }
  next();
});

// --------------------
// API routes (BEFORE SPA)
// --------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ Public corporate enquiry (SAVES TO DB so it appears in /admin/inquiries)
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
      return res.status(400).json({ message: "Missing required fields." });
    }

    await createCorporateInquiry({
      companyName,
      contactName,
      email,
      phone,
      estimatedMonthlyTrips: estimatedMonthlyTrips || null,
      requirements: requirements || null,
      status: "pending",
      internalNotes: null,
      assignedTo: null,
    } as any);

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ /api/corporate-inquiry error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Public driver application (SAVES TO DB so it appears in /admin/inquiries)
// NOTE: This avoids tRPC "input too big" issues (base64/files etc.)
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

    if (!fullName || !email || !phone || !licenseNumber || !availability) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    await createDriverApplication({
      fullName,
      email,
      phone,
      licenseNumber,
      yearsExperience: Number(yearsExperience ?? 0),
      vehicleOwner: Boolean(vehicleOwner ?? false),
      vehicleType: vehicleType || null,
      availability,
      message: message || null,
      status: "pending",
      internalNotes: null,
      assignedTo: null,
    } as any);

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ /api/driver-application error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin auth routes
app.use("/api/admin", adminRoutes);

// ✅ tRPC routes (server transformer must match client transformer)
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

// --------------------
// Frontend (Vite build)
// --------------------
const publicPath = path.resolve(process.cwd(), "dist", "public");

app.use(
  express.static(publicPath, {
    index: false,
    maxAge: "1y",
    immutable: true,
  })
);

// SPA fallback (NON-API only)
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

// --------------------
// Error handling
// --------------------
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

// --------------------
// Startup
// --------------------
async function start() {
  try {
    await ensureDefaultAdmin();
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (msg.includes("admin_users") && msg.includes("doesn't exist")) {
      console.warn(
        "⚠️ admin_users table missing. Run drizzle migrations against Railway DB."
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
