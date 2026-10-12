import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { injectPageMeta } from "./pageHtml";
import { INDEXABLE_PATHS } from "./publicRoutes";
import { PAGE_META } from "../shared/pageMeta";

const indexHtml = fs.readFileSync(
  path.resolve(import.meta.dirname, "..", "client", "index.html"),
  "utf8"
);

describe("page titles in the served HTML", () => {
  it("has an entry for every page in the sitemap", () => {
    for (const p of INDEXABLE_PATHS) {
      expect(PAGE_META[p], p).toBeDefined();
    }
  });

  it("writes each page's own title, description and address", () => {
    for (const p of INDEXABLE_PATHS) {
      const html = injectPageMeta(indexHtml, p);
      const url = `https://cloudcarsltd.com${p}`;
      const title = PAGE_META[p].title.replace(/&/g, "&amp;");

      expect(html, p).toContain(`<title data-static-meta>${title}</title>`);
      expect(html, p).toContain(`<meta property="og:title" content="${title}" />`);
      expect(html, p).toContain(`<meta property="og:url" content="${url}" />`);
      expect(html, p).toContain(`<link rel="canonical" data-static-meta href="${url}" />`);
      expect(html.match(/<title/g), p).toHaveLength(1);
      expect(html.match(/rel="canonical"/g), p).toHaveLength(1);
    }
  });

  it("treats a trailing slash as the same page", () => {
    expect(injectPageMeta(indexHtml, "/faqs/")).toBe(
      injectPageMeta(indexHtml, "/faqs")
    );
  });

  it("leaves the HTML alone for addresses with no entry", () => {
    expect(injectPageMeta(indexHtml, "/admin")).toBe(indexHtml);
    expect(injectPageMeta(indexHtml, "/no-such-page")).toBe(indexHtml);
  });
});
