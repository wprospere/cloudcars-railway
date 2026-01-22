// server/auth/cronKey.ts
import { TRPCError } from "@trpc/server";

/**
 * Protect cron endpoints with a shared secret.
 * Set CRON_KEY in Railway Variables.
 */
export function requireCronKey(providedKey: string) {
  const expected = process.env.CRON_KEY;

  if (!expected) {
    // Misconfiguration: don't allow cron to run without a key set
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "CRON_KEY is not set on the server",
    });
  }

  if (!providedKey || providedKey !== expected) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid cron key",
    });
  }
}
