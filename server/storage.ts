// server/storage.ts
// S3-compatible storage helpers (Railway Buckets or any S3-compatible provider)
//
// Required env vars:
//   S3_ENDPOINT
//   S3_REGION            (optional, defaults to "auto")
//   S3_BUCKET
//   S3_ACCESS_KEY_ID
//   S3_SECRET_ACCESS_KEY
//
// Optional env vars:
//   S3_PUBLIC_BASE_URL   (recommended if bucket is public; gives stable non-expiring URLs)
//
// Notes:
// - forcePathStyle: true is important for many S3-compatible endpoints.
// - storagePut returns BOTH a stable object key and a URL.
//   - If your bucket is public (S3_PUBLIC_BASE_URL set), it returns a stable URL.
//   - If your bucket is private, it returns a presigned GET URL.
// - If you stored presigned URLs in DB (which expire), use refreshUrlFromStored()
//   on read to keep images/docs working.

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type S3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl?: string; // stable public base if bucket is public
};

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeKey(relKey: string): string {
  return String(relKey || "").replace(/^\/+/, "");
}

function stripTrailingSlashes(v: string): string {
  return String(v || "").replace(/\/+$/, "");
}

function joinUrl(base: string, key: string): string {
  return `${stripTrailingSlashes(base)}/${normalizeKey(key)}`;
}

/** Cache config + client (good for serverless-ish environments). */
let _cfg: S3Config | null = null;
let _client: S3Client | null = null;

function getS3Config(): S3Config {
  if (_cfg) return _cfg;

  const endpoint = required("S3_ENDPOINT");
  const region = process.env.S3_REGION || "auto";
  const bucket = required("S3_BUCKET");
  const accessKeyId = required("S3_ACCESS_KEY_ID");
  const secretAccessKey = required("S3_SECRET_ACCESS_KEY");

  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL
    ? stripTrailingSlashes(process.env.S3_PUBLIC_BASE_URL)
    : undefined;

  _cfg = {
    endpoint,
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl,
  };

  return _cfg;
}

function makeS3Client(): S3Client {
  if (_client) return _client;

  const { endpoint, region, accessKeyId, secretAccessKey } = getS3Config();

  _client = new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  return _client;
}

function ensureBuffer(data: Buffer | Uint8Array | string): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (typeof data === "string") return Buffer.from(data, "utf8");
  return Buffer.from(data);
}

/**
 * Uploads data to S3 and returns { key, url }.
 * - If S3_PUBLIC_BASE_URL is set, returns a stable public URL.
 * - Otherwise returns a presigned GET URL (default 7 days).
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const cfg = getS3Config();
  const s3 = makeS3Client();

  const key = normalizeKey(relKey);
  const body = ensureBuffer(data);

  await s3.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  // ✅ Public bucket? return stable URL
  if (cfg.publicBaseUrl) {
    return { key, url: joinUrl(cfg.publicBaseUrl, key) };
  }

  // ✅ Private bucket: return presigned GET URL
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: cfg.bucket, Key: key }),
    { expiresIn: 60 * 60 * 24 * 7 } // 7 days
  );

  return { key, url };
}

/**
 * Returns { key, url } for downloading.
 * - If S3_PUBLIC_BASE_URL is set, returns stable public URL.
 * - Otherwise returns a presigned GET URL (default 1 hour).
 */
export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const cfg = getS3Config();
  const s3 = makeS3Client();

  const key = normalizeKey(relKey);

  if (cfg.publicBaseUrl) {
    return { key, url: joinUrl(cfg.publicBaseUrl, key) };
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: cfg.bucket, Key: key }),
    { expiresIn: 60 * 60 } // 1 hour
  );

  return { key, url };
}

/* -------------------------------------------------------------------------- */
/* ✅ Helpers to fix "images not showing" when DB stored old URLs OR keys      */
/* -------------------------------------------------------------------------- */

/**
 * Accepts either:
 *  - a raw key like "cms/2026-01-22/abc.png"
 *  - or a full URL like "https://storage.railway.app/<bucket>/cms/...?.X-Amz-..."
 *  - or a public URL like "https://cdn.yoursite.com/cms/abc.png"
 *
 * Returns object key or null if it can't parse.
 */
export function extractKeyFromStoredUrlOrKey(stored: string): string | null {
  if (!stored) return null;

  const raw = String(stored).trim();
  if (!raw) return null;

  // ✅ already a key
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    return normalizeKey(raw);
  }

  try {
    const u = new URL(raw);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;

    const cfg = getS3Config();

    // Common pattern: /<bucket>/<key...>
    if (parts[0] === cfg.bucket && parts.length >= 2) {
      return parts.slice(1).join("/");
    }

    // Some providers/CDNs: /<key...> (no bucket segment)
    return parts.join("/");
  } catch {
    return null;
  }
}

/**
 * Takes what is stored in DB (key or URL) and returns a URL that works now:
 * - If S3_PUBLIC_BASE_URL is set: returns a stable public URL.
 * - Otherwise: returns a fresh presigned URL from storageGet().
 */
export async function refreshUrlFromStored(stored: string | null): Promise<string | null> {
  if (!stored) return null;

  const key = extractKeyFromStoredUrlOrKey(stored);
  if (!key) return stored; // if we can't parse, return as-is

  const cfg = getS3Config();

  // ✅ Public bucket: stable URL
  if (cfg.publicBaseUrl) {
    return joinUrl(cfg.publicBaseUrl, key);
  }

  // ✅ Private bucket: re-sign
  const { url } = await storageGet(key);
  return url;
}
