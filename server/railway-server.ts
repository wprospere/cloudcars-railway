import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "./routers.js";
import { createContext } from "./railway-trpc.js";
import { ensureDefaultAdmin } from "./auth/ensureAdmin.js";
import { adminRoutes } from "./auth/adminRoutes.js";

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

// ✅ Admin auth routes
app.use("/api/admin", adminRoutes);

// ✅ tRPC routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
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
app.use(express.static(publicPath));

// SPA fallback (NON-API only)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
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