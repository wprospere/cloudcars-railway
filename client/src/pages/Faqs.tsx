import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, props);
  }
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

function FaqsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="bg-card border-b border-border">
          <div className="container py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="h-10 w-80 bg-muted rounded animate-pulse" />
            <div className="mt-3 h-4 w-44 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/50 border border-border rounded-lg p-6"
              >
                <div className="h-5 w-56 bg-muted rounded animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Faqs() {
  const { data, isLoading, error } = trpc.cms.getPolicyDoc.useQuery(
    { slug: "faqs" },
    { staleTime: 60_000 }
  );

  if (isLoading) return <FaqsLoading />;

  const title = data?.title?.trim() || "FAQs";
  const lastUpdated = formatDate(data?.lastUpdated) || "2024";
  const markdown = data?.markdown ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="bg-card border-b border-border">
          <div className="container py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
              onClick={() =>
                track("nav_click", { location: "faqs_hero", to: "home_link" })
              }
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2">
              Last updated: {lastUpdated}
            </p>

            {error && (
              <p className="text-sm text-destructive mt-3">
                Failed to load CMS FAQ content. Showing latest available content.
              </p>
            )}
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-4xl mx-auto prose prose-invert prose-green">
            {markdown?.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-primary border-b border-border pb-2 mt-12">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-primary mt-8 mb-3">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-foreground mt-6 mb-2">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-muted-foreground leading-relaxed">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => {
                    const isExternal =
                      !!href &&
                      (href.startsWith("http://") || href.startsWith("https://"));

                    return (
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-primary hover:underline"
                        onClick={() => {
                          if (isExternal) {
                            track("external_link_click", {
                              location: "faqs_markdown",
                              label: String(children ?? "link"),
                              href: href ?? "",
                            });
                          }
                        }}
                      >
                        {children}
                      </a>
                    );
                  },
                  blockquote: ({ children }) => (
                    <div className="bg-card border border-border rounded-lg p-6 my-6">
                      <div className="[&>p]:m-0">{children}</div>
                    </div>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            ) : (
              <div className="bg-card/50 border border-border rounded-lg p-6 mb-8">
                <p className="text-muted-foreground leading-relaxed m-0">
                  FAQs content is not yet set in the CMS.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
