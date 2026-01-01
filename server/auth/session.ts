import { serialize, parse } from "cookie";
import { createHash, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";

const COOKIE_NAME = "cc_admin";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function sign(value: string): string {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  return createHash("sha256").update(`${value}.${secret}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function getCookieOptions(req: Request) {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,                 // MUST be true on Railway HTTPS
    sameSite: "lax" as const,
    path: "/",
    maxAge: ONE_WEEK_SECONDS,
    domain: isProd ? ".cloudcarsltd.com" : undefined,
  };
}

export function setAdminCookie(res: Response, adminId: number, req: Request) {
  const idStr = String(adminId);
  const value = `${idStr}.${sign(idStr)}`;

  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, value, getCookieOptions(req))
  );
}

export function clearAdminCookie(res: Response, req: Request) {
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      ...getCookieOptions(req),
      maxAge: 0,
    })
  );
}

export function readAdminIdFromCookie(req: Request): number | null {
  const rawCookieHeader = req.headers?.cookie;
  if (!rawCookieHeader) return null;

  const cookies = parse(rawCookieHeader);
  const raw = cookies[COOKIE_NAME];
  if (!raw) return null;

  const [idStr, hash] = String(raw).split(".");
  const id = Number(idStr);

  if (!idStr || !hash || !Number.isFinite(id) || id <= 0) return null;

  const expected = sign(String(id));
  if (!safeEqual(hash, expected)) return null;

  return id;
}
