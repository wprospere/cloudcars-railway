// server/security/turnstile.ts
//
// Shared spam-protection helpers used by all public form routes.
// Verifies a Cloudflare Turnstile token server-side using the SECRET key,
// checks the honeypot field, and extracts the real client IP.
//
// Requires TURNSTILE_SECRET_KEY to be set in Railway -> Variables.

import type { Request } from "express";

/**
 * Verify a Turnstile token with Cloudflare. Returns true only if Cloudflare
 * confirms success. Fails CLOSED: if the secret key is missing or the request
 * errors, it returns false (rejects the submission) rather than letting it
 * through.
 */
export async function verifyTurnstile(
  token: string,
  ip?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY not set — rejecting form submit");
    return false;
  }

  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  try {
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form }
    );
    const data = (await r.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("Turnstile verify request failed:", e);
    return false;
  }
}

/**
 * Honeypot check. The hidden "company_website" field is invisible to real
 * users, so a non-empty value means a bot filled every field on the form.
 */
export function honeypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Best-available client IP from an Express request (Cloudflare-aware).
 */
export function clientIpFromReq(req: Request): string | undefined {
  return (
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip
  );
}
