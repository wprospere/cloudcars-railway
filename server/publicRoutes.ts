// Single list of the site's page addresses. Keep in sync with client/src/App.tsx:
// it drives the sitemap, robots.txt and which addresses get a real 404 status.

export const SITE_URL = "https://cloudcarsltd.com";

// Pages that should appear in search results (and the sitemap).
export const INDEXABLE_PATHS = [
  "/",
  "/taxi-nottingham",
  "/airport-transfers-nottingham",
  "/east-midlands-airport-taxi",
  "/nottingham-to-east-midlands-airport",
  "/executive-car-nottingham",
  "/7-seater-taxi-nottingham",
  "/courier-services-nottingham",
  "/corporate-transport-nottingham",
  "/taxi-beeston",
  "/taxi-west-bridgford",
  "/taxi-wollaton",
  "/taxi-edwalton",
  "/drive-for-cloud-cars",
  "/partner-with-cloud-cars",
  "/faqs",
  "/terms",
  "/privacy",
  "/cookies",
  "/train-airport-transfer-policy",
] as const;

// Valid pages that must not be indexed (private or token-based).
const PRIVATE_PATTERNS: RegExp[] = [
  /^\/admin(\/.*)?$/i,
  /^\/account(\/[^/]+)?$/i,
  /^\/driver\/onboarding(\/[^/]+)?$/i,
];

const EXTRA_VALID_PATHS = ["/404"];

const indexable = new Set<string>(INDEXABLE_PATHS);
const extra = new Set<string>(EXTRA_VALID_PATHS);

function normalise(p: string) {
  const trimmed = p.length > 1 ? p.replace(/\/+$/, "") : p;
  return trimmed || "/";
}

export function isPrivatePath(p: string) {
  return PRIVATE_PATTERNS.some((re) => re.test(normalise(p)));
}

export function isKnownPage(p: string) {
  const n = normalise(p);
  return indexable.has(n) || extra.has(n) || isPrivatePath(n);
}
