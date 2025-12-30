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

// ✅ Railway / reverse proxy (important for secure cookies + req.secure)
app.set("trust proxy", 1);

// --------------------
// Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Force lowercase admin URLs (fix /ADMIN/LOGIN etc.)
// Place BEFORE static + SPA fallback so it always redirects.
app.use((req, res, next) => {
  if (/^\/admin/i.test(req.path)) {
    const lower = req.originalUrl.toLowerCase();
    if (lower !== req.originalUrl) {
      return res.redirect(301, lower);
    }
  }
  next();
});

// NOTE: ✅ CORS REMOVED
// You are serving frontend + backend on the same origin (www.cloudcarsltd.com),
// so you do NOT need CORS. Your previous CORS middleware was causing 403 on /assets.

// --------------------
// API routes
// --------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Admin auth routes (email/password login)
app.use("/api/admin", adminRoutes);

// Don’t let SPA catch unknown API routes
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "API route not found" })
);

// --------------------
// Frontend (Vite build)
// --------------------
const publicPath = path.resolve(process.cwd(), "dist", "public");
app.use(express.static(publicPath));

// SPA fallback (non-API routes only)
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
  // ✅ Deploy-safe: don't crash the whole server if admin bootstrap fails because table isn't created yet
  try {
    await ensureDefaultAdmin();
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (msg.includes("admin_users") && msg.includes("doesn't exist")) {
      console.warn(
        "⚠️ admin_users table missing. Run `drizzle-kit push/migrate` against Railway DB. Skipping admin bootstrap."
      );
    } else {
      console.error("❌ ensureDefaultAdmin failed:", err);
      // If you WANT to crash on real errors, uncomment next line:
      // throw err;
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Cloud Cars server running on port ${PORT}`);
  });
}

start();