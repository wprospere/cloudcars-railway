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

// --------------------
// Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS (safe for cookies). If frontend + backend are same-origin, this is harmless.
// If they are cross-origin, this is required for credentials: "include".
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;

  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

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
app.use("/api", (_req, res) => res.status(404).json({ error: "API route not found" }));

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
  await ensureDefaultAdmin();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Cloud Cars server running on port ${PORT}`);
  });
}

start();
