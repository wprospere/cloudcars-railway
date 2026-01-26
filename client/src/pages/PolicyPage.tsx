import { Link, useLocation } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") w.gtag("event", eventName, props);
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PolicyLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png" alt="Cloud Cars" className="h-10 w-auto" />
            </Link>

            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-primary font-medium">Loading policy…</span>
          </div>

          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          <div className="mt-4 h-5 w-[520px] max-w-full bg-muted rounded animate-pulse" />
          <div className="mt-2 h-5 w-[420px] max-w-full bg-muted rounded animate-pulse" />
          <div className="mt-4 h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ✅ Pull slug from URL using wouter (example routes: /policy/privacy, /policy/terms, /policy/cookies)
function getSlugFromPath(path: string): "privacy" | "terms" | "cookies" {
  const parts = path.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const maybe = parts[parts.length - 1] as string | undefined;

  if (maybe === "privacy" || maybe === "terms" || maybe === "cookies") return maybe;
  return "privacy";
}

export default function PolicyPage() {
  const [location] = useLocation();
  const slug = getSlugFromPath(location);

  const { data, isLoading, error } = trpc.cms.getPolicyDoc.useQuery(
    { slug },
    { staleTime: 60_000 }
  );

  if (isLoading) return <PolicyLoading />;

  const title = data?.title?.trim() || "Policy";
  const lastUpdated =
    formatDate(data?.lastUpdated) || "15th August 2019"; // fallback until set in CMS

  const markdown = data?.markdown ?? "";

  const badgeText =
    slug === "privacy"
      ? "Your Data, Protected"
      : slug === "terms"
      ? "Terms of Service"
      : "Cookie Policy";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => track("nav_click", { location: "policy_header", to: "home_logo" })}
            >
              <img src="/logo.png" alt="Cloud Cars" className="h-10 w-auto" />
            </Link>

            <Link
              href="/"
              onClick={() => track("nav_click", { location: "policy_header", to: "home_button" })}
            >
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-primary font-medium">{badgeText}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>

          <p className="text-sm text-muted-foreground mt-4">Last updated: {lastUpdated}</p>

          {error && (
            <p className="text-sm text-destructive mt-3">
              Failed to load policy content. Showing latest available content.
            </p>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {markdown?.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <div className="bg-card border border-border rounded-lg p-6 mt-8 first:mt-0">
                      <h2 className="text-2xl font-bold text-foreground mb-4">{children}</h2>
                    </div>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      onClick={() =>
                        track("external_link_click", {
                          location: "policy_markdown",
                          label: String(children ?? "link"),
                          href: href ?? "",
                        })
                      }
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Policy content is not yet set in the CMS.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/" onClick={() => track("nav_click", { location: "policy_footer", to: "home_button" })}>
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
