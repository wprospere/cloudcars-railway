import { serialize } from "cookie";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE_NAME = "cc_admin";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

/**
 * Sign the admin ID so the cookie cannot be tampered with
 */
function sign(value: string) {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  return createHash("sha256")
    .update(`${value}.${secret}`)
    .digest("hex");
}

/**
 * Set admin session cookie
 * Works on Railway (HTTPS) and in Incognito
 */
export function setAdminCookie(res: any, adminId: number) {
  const value = `v2_${adminId}.${sign(String(adminId))}`;

  const cookie = serialize(COOKIE_NAME, value, {
    httpOnly: true,
    secure: true,        // REQUIRED on Railway
    sameSite: "lax",     // Correct for same-origin
    path: "/",           // REQUIRED
    maxAge: ONE_WEEK_SECONDS,
  });

  // Do not overwrite other cookies
  res.append("Set-Cookie", cookie);
}

/**
 * Clear admin session cookie
 */
export function clearAdminCookie(res: any) {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.append("Set-Cookie", cookie);
}

/**
 * Read and verify admin ID from cookie
 */
export function readAdminIdFromCookie(req: any): number | null {
  const raw = req.headers?.cookie ?? "";

  const match = raw
    .split(";")
    .map((s: string) => s.trim())
    .find((s: string) => s.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  const value = decodeURIComponent(match.split("=")[1] ?? "");
  const [idStr, sig] = value.split(".");
  const id = Number(idStr);

  if (!Number.isFinite(id) || !sig) return null;

  const expected = sign(String(id));
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  return id;
}
