import { describe, expect, it } from "vitest";
import express from "express";
import type { AddressInfo } from "net";
import { adminRoutes, requireAdmin } from "./auth/adminRoutes";

function startApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin", requireAdmin);
  app.get("/api/admin/driver-applications", (_req, res) => res.json({ rows: [] }));
  app.post("/api/admin/cms-upload", (_req, res) => res.json({ ok: true }));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/admin`;
  return { server, base };
}

describe("/api/admin guard", () => {
  it("rejects requests with no admin cookie", async () => {
    const { server, base } = startApp();
    try {
      const get = await fetch(`${base}/driver-applications`);
      expect(get.status).toBe(401);
      const post = await fetch(`${base}/cms-upload`, { method: "POST" });
      expect(post.status).toBe(401);
    } finally {
      server.close();
    }
  });

  it("rejects a cookie with a bad signature", async () => {
    const { server, base } = startApp();
    try {
      const res = await fetch(`${base}/driver-applications`, {
        headers: { cookie: "cc_admin=1.notavalidsignature" },
      });
      expect(res.status).toBe(401);
    } finally {
      server.close();
    }
  });
});
