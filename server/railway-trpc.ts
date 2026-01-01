import { initTRPC, TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import superjson from "superjson";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE_NAME = "cc_admin";

// Same signing approach you showed before:
// sha256(`${value}.${secret}`)
function sign(value: string) {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  return createHash("sha256").update(`${value}.${secret}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Attempt to read and verify the admin cookie.
 * Cookie format: `${adminId}.${hash}`
 */
function getAdminFromCookie(req: Request): { id: number; role: "admin" } | null {
  // cookie-parser puts cookies here
  const cookies: any = (req as any).cookies;
  const raw = cookies?.[COOKIE_NAME];
  if (!raw || typeof raw !== "string") return null;

  const [idStr, hash] = raw.split(".");
  const id = Number(idStr);
  if (!idStr || !hash || !Number.isFinite(id) || id <= 0) return null;

  const expected = sign(String(id));
  if (!safeEqual(hash, expected)) return null;

  return { id, role: "admin" };
}

/**
 * Optional header fallback (handy for testing):
 * set ADMIN_TOKEN in Railway Variables,
 * then send header: x-admin-token: <ADMIN_TOKEN>
 */
function getAdminFromHeader(req: Request): { id: number; role: "admin" } | null {
  const token = req.header("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  if (!token || !expected) return null;
  if (token !== expected) return null;
  return { id: 0, role: "admin" };
}

export const createContext = ({ req, res }: { req: Request; res: Response }) => {
  const adminFromCookie = getAdminFromCookie(req);
  const adminFromHeader = getAdminFromHeader(req);

  return {
    req,
    res,
    user: (adminFromCookie || adminFromHeader) as
      | { id: number; role: "admin" | "user" }
      | null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Now actually protected:
 * Anything using protectedProcedure requires ctx.user.
 * (Your adminProcedure builds on this, so admin routes work properly.)
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
  }
  return next({ ctx });
});
