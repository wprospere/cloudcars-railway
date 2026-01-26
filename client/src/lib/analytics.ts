// client/src/lib/analytics.ts
export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export function track(eventName: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;

  const w = window as any;

  // GA4 (gtag)
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, props);
  }
}
