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
// Notes:
// - forcePathStyle: true is important for many S3-compatible endpoints.
// - storagePut returns BOTH a stable object key and a URL.
//   - If your bucket is public, it returns a direct URL.
//   - If your bucket is private, set S3_PUBLIC_BASE_URL="" and it returns a presigned GET URL.

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type S3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;

  // Optional:
  // If your bucket is PUBLIC, set this to the public base URL that serves objects, e.g.
  //   https://<your-public-domain-or-cdn>/<bucket>  (depends on provider)
  // If set, storageGet/storagePut will return stable public URLs (non-expiring).
  publicBaseUrl?: string;
};

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function stripTrailingSlashes(v: string): string {
  return v.replace(/\/+$/, "");
}

function joinUrl(base: string, key: string): string {
  return `${stripTrailingSlashes(base)}/${normalizeKey(key)}`;
}

function getS3Config(): S3Config {
  const endpoint = required("S3_ENDPOINT");
  const region = process.env.S3_REGION || "auto";
  const bucket = required("S3_BUCKET");
  const accessKeyId = required("S3_ACCESS_KEY_ID");
  const secretAccessKey = required("S3_SECRET_ACCESS_KEY");

  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL
    ? stripTrailingSlashes(process.env.S3_PUBLIC_BASE_URL)
    : undefined;

  return { endpoint, region, bucket, accessKeyId, secretAccessKey, publicBaseUrl };
}

function makeS3Client() {
  const { endpoint, region, accessKeyId, secretAccessKey } = getS3Config();

  return new S3Client({
    region,
    endpoint, // IMPORTANT for S3-compatible providers
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // IMPORTANT for many S3-compatible providers
  });
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

  // Public bucket? return stable URL
  if (cfg.publicBaseUrl) {
    return { key, url: joinUrl(cfg.publicBaseUrl, key) };
  }

  // Private bucket: return presigned GET URL
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
