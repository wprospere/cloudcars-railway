import { serialize } from "cookie";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE_NAME = "cc_admin";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

/**
 * Sign the admin ID so the cookie cannot be tampered with
 */
function sign(value: string) {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  return createHash("sha256").update(`${value}.${secret}`).digest("hex");
}

/**
 * Set admin session cookie
 * Works on Railway (HTTPS) and locally (HTTP)
 */
export function setAdminCookie(res: any, adminId: number) {
  const isProd = process.env.NODE_ENV === "production";

  // IMPORTANT: cookie format must match reader
  // Format: "v2.<id>.<sig>"
  const idStr = String(adminId);
  const value = `v2.${idStr}.${sign(idStr)}`;

  const cookie = serialize(COOKIE_NAME, value, {
    httpOnly: true,
    secure: isProd,     // ✅ true on Railway, false on local http
    sameSite: "lax",    // ✅ correct for same-origin (www.cloudcarsltd.com)
    path: "/",          // ✅ required
    maxAge: ONE_WEEK_SECONDS,
  });

  // Express supports multiple Set-Cookie headers; append is safest
  if (typeof res.append === "function") res.append("Set-Cookie", cookie);
  else res.setHeader("Set-Cookie", cookie);
}

/**
 * Clear admin session cookie
 */
export function clearAdminCookie(res: any) {
  const isProd = process.env.NODE_ENV === "production";

  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  if (typeof res.append === "function") res.append("Set-Cookie", cookie);
  else res.setHeader("Set-Cookie", cookie);
}

/**
 * Read and verify admin ID from cookie
 * Requires cookieParser() middleware (which you already use)
 */
export function readAdminIdFromCookie(req: any): number | null {
  // Prefer cookie-parser
  const raw = req.cookies?.[COOKIE_NAME] ?? null;
  if (!raw || typeof raw !== "string") return null;

  // Expected: "v2.<id>.<sig>"
  const parts = raw.split(".");
  if (parts.length !== 3) return null;

  const [version, idStr, sig] = parts;
  if (version !== "v2") return null;

  const id = Number(idStr);
  if (!Number.isFinite(id)) return null;

  const expected = sign(idStr);

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  return id;
}
