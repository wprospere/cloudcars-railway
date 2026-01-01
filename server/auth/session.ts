import { serialize, parse } from "cookie";
import { createHash, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";

const COOKIE_NAME = "cc_admin";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

/**
 * Sign cookie value
 */
function sign(value: string): string {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  return createHash("sha256").update(`${value}.${secret}`).digest("hex");
}

/**
 * Constant-time compare
 */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Set admin auth cookie (Railway + production safe)
 */
export function setAdminCookie(res: Response, adminId: number) {
  const value = `${adminId}.${sign(String(adminId))}`;
  const isProd = process.env.NODE_ENV === "production";

  // ✅ Share cookie across www + non-www
  const domain = isProd ? ".cloudcarsltd.com" : undefined;

  res.setHeader("Set-Cookie", [
    // 🔥 Clear any old duplicate cookies first
    serialize(COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
      domain: "cloudcarsltd.com",
    }),
    serialize(COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
      domain: "www.cloudcarsltd.com",
    }),

    // ✅ Correct cookie
    serialize(COOKIE_NAME, value, {
      httpOnly: true,
      secure: isProd,        // REQUIRED for HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK_SECONDS,
      domain,
    }),
  ]);
}

/**
 * Clear admin cookie (logout)
 */
export function clearAdminCookie(res: Response) {
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
      domain: ".cloudcarsltd.com",
    })
  );
}

/**
 * Read + verify admin session
 */
export function getAdminFromRequest(req: Request): number | null {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const raw = cookies[COOKIE_NAME];
  if (!raw) return null;

  const [id, sig] = raw.split(".");
  if (!id || !sig) return null;

  const expected = sign(id);
  if (!safeEqual(sig, expected)) return null;

  return Number(id);
}
