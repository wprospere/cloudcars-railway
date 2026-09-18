// server/sms.ts
// SMS sending via Esendex's REST API (https://developers.esendex.com/).
//
// Required env vars:
//   ESENDEX_ACCOUNT_REFERENCE   e.g. "EX0123456"
//   ESENDEX_USERNAME            your Esendex account email
//   ESENDEX_PASSWORD            your Esendex account/API password
//
// Auth: HTTP Basic. Endpoint: POST /v1.0/messagedispatcher.

import axios from "axios";

const ESENDEX_URL = "https://api.esendex.com/v1.0/messagedispatcher";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

/**
 * Converts a UK mobile number in local format (07...) to E.164 (+447...).
 * Leaves already-international numbers (+44... or 44...) untouched.
 */
export function normalizeUkMobile(phone: string): string {
  const trimmed = String(phone || "").replace(/[\s()-]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("00")) return `+${trimmed.slice(2)}`;
  if (trimmed.startsWith("0")) return `+44${trimmed.slice(1)}`;
  if (trimmed.startsWith("44")) return `+${trimmed}`;
  return trimmed;
}

/**
 * Sends a single SMS via Esendex. Returns true on success, false on failure
 * (errors are logged, not thrown, so a failed text doesn't crash the caller —
 * the tRPC mutation decides how to surface that to the admin).
 */
export async function sendSms(to: string, body: string): Promise<boolean> {
  try {
    const accountreference = requiredEnv("ESENDEX_ACCOUNT_REFERENCE");
    const username = requiredEnv("ESENDEX_USERNAME");
    const password = requiredEnv("ESENDEX_PASSWORD");

    await axios.post(
      ESENDEX_URL,
      {
        accountreference,
        messages: [{ to: normalizeUkMobile(to), body }],
      },
      {
        auth: { username, password },
        headers: { "Content-Type": "application/json" },
        timeout: 15_000,
      }
    );

    return true;
  } catch (err: any) {
    console.error(
      "⚠️ Esendex SMS send failed:",
      err?.response?.data ?? err?.message ?? err
    );
    return false;
  }
}
