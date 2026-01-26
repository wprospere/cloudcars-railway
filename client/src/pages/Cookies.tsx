// client/src/pages/Cookies.tsx
import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Cookie, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;

  // ✅ Google Analytics 4 (gtag)
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, props);
  }
}

function formatLastUpdated(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value; // if it's not ISO, just show raw
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Cookies() {
  const { data, isLoading, error } = trpc.cms.getPolicyDoc.useQuery({
    slug: "cookies",
  });

  const lastUpdatedLabel = useMemo(
    () => formatLastUpdated(data?.lastUpdated) ?? "—",
    [data?.lastUpdated]
  );

  const title = data?.title ?? "Cookie Policy";
  const markdown = (data?.markdown ?? "").trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link
            href="/"
            onClick={() =>
              track("nav_click", { location: "cookies_header", to: "home_logo" })
            }
          >
            <img src="/logo.png" alt="Cloud Cars" className="h-10 w-auto" />
          </Link>

          <Link
            href="/"
            onClick={() =>
              track("nav_click", {
                location: "cookies_header",
                to: "home_button",
              })
            }
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium text-primary">
              Cookie Policy
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl">
            This policy explains how Cloud Cars Ltd uses cookies and similar
            technologies on our website and mobile applications.
          </p>

          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {isLoading ? "Loading…" : lastUpdatedLabel}
          </p>

          {error ? (
            <p className="text-sm text-destructive mt-3">
              Could not load cookie policy from CMS.
            </p>
          ) : null}
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
            {isLoading ? (
              <div className="text-muted-foreground">Loading policy…</div>
            ) : markdown ? (
              <article className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="space-y-3 text-muted-foreground">
                <p>
                  This Cookie Policy has not been published yet.
                </p>
                <p className="text-sm">
                  Admins can publish it in the CMS by updating the{" "}
                  <code>policy.cookies</code> section.
                </p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Questions?</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us:
            </p>

            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:info@cloudcarsltd.com"
                  className="text-primary hover:underline"
                  onClick={() =>
                    track("contact_click", {
                      type: "email",
                      location: "cookies_page",
                    })
                  }
                >
                  info@cloudcarsltd.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong>{" "}
                <a
                  href="tel:+441158244244"
                  className="text-primary hover:underline"
                  onClick={() =>
                    track("contact_click", {
                      type: "phone",
                      location: "cookies_page",
                    })
                  }
                >
                  0115 8 244 244
                </a>
              </p>
              <p>
                <strong className="text-foreground">Address:</strong> Unit 5
                Medway Street, Nottingham, NG8 1PN
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              onClick={() =>
                track("nav_click", { location: "cookies_footer", to: "home_button" })
              }
            >
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
