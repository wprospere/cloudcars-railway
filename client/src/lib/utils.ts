import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * tRPC surfaces zod input-validation failures as a JSON-stringified array of
 * issues in error.message. Pull out the first issue's message instead of
 * dumping that raw JSON in an alert().
 */
export function getErrorMessage(error: any, fallback: string): string {
  const msg = error?.message;
  if (typeof msg !== "string" || !msg) return fallback;

  try {
    const parsed = JSON.parse(msg);
    if (Array.isArray(parsed) && typeof parsed[0]?.message === "string") {
      return parsed[0].message;
    }
  } catch {
    // Not JSON — a normal thrown message, use it as-is.
  }

  return msg;
}
