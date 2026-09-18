// server/sms.ts
// SMS sending via Esendex's REST API (https://developers.esendex.com/).
//
// Required env vars:
//   ESENDEX_ACCOUNT_REFERENCE   e.g. "EX0123456"
//   ESENDEX_USERNAME            your Esendex account email
//   ESENDEX_PASSWORD            your Esendex account/API password
//
// Optional env vars:
//   ESENDEX_SENDER_ID           registered UK sender ID (max 11 alphanumeric
//                               chars). Since Sept 2023, UK carriers block
//                               generic/unregistered sender IDs — especially
//                               messages containing a link — so this must be
//                               a sender ID already registered on the
//                               account. Defaults to "CloudCars".
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

export type SendSmsResult = { ok: true } | { ok: false; error: string };

/**
 * Sends a single SMS via Esendex. Returns { ok: false, error } on failure
 * instead of throwing, so a failed text doesn't crash the caller — the
 * tRPC mutation decides how to surface `error` to the admin.
 */
export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  try {
    const accountreference = requiredEnv("ESENDEX_ACCOUNT_REFERENCE");
    const username = requiredEnv("ESENDEX_USERNAME");
    const password = requiredEnv("ESENDEX_PASSWORD");
    const from = process.env.ESENDEX_SENDER_ID || "CloudCars";

    await axios.post(
      ESENDEX_URL,
      {
        accountreference,
        from,
        messages: [{ to: normalizeUkMobile(to), body }],
      },
      {
        auth: { username, password },
        headers: { "Content-Type": "application/json" },
        timeout: 15_000,
      }
    );

    return { ok: true };
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const detail =
      (typeof data === "string" && data) ||
      (data ? JSON.stringify(data) : null) ||
      err?.message ||
      String(err);

    const error = status ? `HTTP ${status}: ${detail}` : detail;

    // Single string argument — Railway's log viewer has been dropping the
    // second console.error() argument, hiding the actual error payload.
    console.error(`⚠️ Esendex SMS send failed: ${error}`);

    return { ok: false, error };
  }
}
