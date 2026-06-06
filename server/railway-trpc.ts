// server/security/turnstile.ts
import type { Request } from "express";

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
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

// Real users never fill this hidden field; bots that fill every field trip it.
export function honeypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

// Pull the best client IP out of an Express request (Cloudflare-aware).
export function clientIpFromReq(req: Request): string | undefined {
  return (
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip
  );
}