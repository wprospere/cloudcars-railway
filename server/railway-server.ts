import express from "express";
import path from "path";
import fs from "fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./railway-trpc.js";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Don’t let SPA catch unknown API routes
app.use("/api", (_req, res) => res.status(404).json({ error: "API route not found" }));

// ✅ Serve frontend built by Vite (dist/public)
const publicPath = path.resolve(process.cwd(), 'dist', 'public');
app.use(express.static(publicPath));

// SPA fallback (non-API routes only)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Cloud Cars server running on port ${PORT}`);
});
