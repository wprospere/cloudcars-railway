// Writes a page's own title, description and address into index.html before it
// is sent, so link previews (WhatsApp, Facebook, LinkedIn) and crawlers that
// don't run scripts see that page rather than the generic homepage text.

import fs from "fs";
import {
  SITE_URL,
  getPageMeta,
  normalisePagePath,
} from "../shared/pageMeta.js";

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Returns the HTML unchanged for addresses with no entry in PAGE_META. */
export function injectPageMeta(html: string, reqPath: string): string {
  const meta = getPageMeta(reqPath);
  if (!meta) return html;

  const path = normalisePagePath(reqPath);
  const url = `${SITE_URL}${path}`;
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);

  // Function replacers so "$" in a title or description is never read as a pattern.
  return html
    .replace(
      /<title data-static-meta>[\s\S]*?<\/title>/,
      () => `<title data-static-meta>${title}</title>`
    )
    .replace(
      /<meta name="description" data-static-meta content="[^"]*"\s*\/>/,
      () =>
        `<meta name="description" data-static-meta content="${description}" />\n    <link rel="canonical" data-static-meta href="${url}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      () => `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      () => `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      () => `<meta property="og:url" content="${url}" />`
    );
}

let cached: { file: string; mtimeMs: number; html: string } | null = null;

function readIndexHtml(file: string) {
  const { mtimeMs } = fs.statSync(file);
  if (!cached || cached.file !== file || cached.mtimeMs !== mtimeMs) {
    cached = { file, mtimeMs, html: fs.readFileSync(file, "utf8") };
  }
  return cached.html;
}

export function renderIndexHtml(indexFile: string, reqPath: string) {
  return injectPageMeta(readIndexHtml(indexFile), reqPath);
}
