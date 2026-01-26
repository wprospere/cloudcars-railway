import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { Link } from "wouter";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

/** Very small markdown → text helper for schema output (good enough for FAQs). */
function stripMarkdown(md: string) {
  return (
    md
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s*>\s?/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function parseFaqMarkdown(markdown: string): {
  introMarkdown: string;
  items: Array<{ q: string; aMarkdown: string }>;
} {
  const src = String(markdown || "");
  const lines = src.split(/\r?\n/);

  const items: Array<{ q: string; aMarkdown: string }> = [];
  let intro: string[] = [];

  let currentQ: string | null = null;
  let currentA: string[] = [];

  const flush = () => {
    if (currentQ) {
      const answer = currentA.join("\n").trim();
      items.push({ q: currentQ.trim(), aMarkdown: answer });
    }
    currentQ = null;
    currentA = [];
  };

  for (const line of lines) {
    const m = line.match(/^##\s+(.+)\s*$/);
    if (m) {
      flush();
      currentQ = m[1];
      continue;
    }

    if (!currentQ) intro.push(line);
    else currentA.push(line);
  }

  flush();

  return {
    introMarkdown: intro.join("\n").trim(),
    items,
  };
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

            <div className="h-10 w-64 bg-muted rounded animate-pulse" />
            <div className="mt-3 h-4 w-44 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/50 border border-border rounded-lg p-6"
              >
                <div className="h-5 w-72 bg-muted rounded animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
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

  const title = data?.title?.trim() || "FAQs";
  const lastUpdated = formatDate(data?.lastUpdated) || "2024";
  const markdown = data?.markdown ?? "";

  const { introMarkdown, items } = useMemo(
    () => parseFaqMarkdown(markdown),
    [markdown]
  );

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((it) => {
      const hay = (it.q || "") + " " + stripMarkdown(it.aMarkdown || "");
      return hay.toLowerCase().includes(q);
    });
  }, [items, query]);

  const schemaJsonLd = useMemo(() => {
    const entities = items
      .filter((it) => it.q.trim() && it.aMarkdown.trim())
      .slice(0, 30)
      .map((it) => ({
        "@type": "Question",
        name: stripMarkdown(it.q),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripMarkdown(it.aMarkdown),
        },
      }));

    if (!entities.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entities,
    };
  }, [items]);

  useEffect(() => {
    track("page_view", { page: "faqs" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <FaqsLoading />;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {schemaJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      ) : null}

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

            {error ? (
              <p className="text-sm text-destructive mt-3">
                Failed to load CMS FAQ content. Showing latest available content.
              </p>
            ) : null}
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">Search FAQs</div>
                  <div className="text-sm text-muted-foreground">
                    Type a keyword like “airport”, “payment”, “booking”, “waiting”.
                  </div>
                </div>

                <div className="w-full md:w-80">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                  />
                </div>
              </div>
            </Card>

            {introMarkdown?.trim() ? (
              <Card className="p-6">
                <div className="prose prose-invert prose-green max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {introMarkdown}
                  </ReactMarkdown>
                </div>
              </Card>
            ) : null}

            {filtered.length ? (
              <Accordion type="single" collapsible className="w-full">
                {filtered.map((it, idx) => (
                  <AccordionItem
                    key={`${it.q}-${idx}`}
                    value={`item-${idx}`}
                    className="border border-border rounded-lg mb-3 px-3 bg-card/40"
                  >
                    <AccordionTrigger
                      onClick={() =>
                        track("faq_open", {
                          question: stripMarkdown(it.q).slice(0, 120),
                        })
                      }
                      className="text-left"
                    >
                      {it.q}
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="prose prose-invert prose-green max-w-none pt-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="text-muted-foreground leading-relaxed">
                                {children}
                              </p>
                            ),
                            a: ({ href, children }) => {
                              const isMail = (href ?? "").startsWith("mailto:");
                              const isTel = (href ?? "").startsWith("tel:");
                              const isExternal =
                                !!href &&
                                (href.startsWith("http://") ||
                                  href.startsWith("https://"));

                              return (
                                <a
                                  href={href}
                                  target={isExternal ? "_blank" : undefined}
                                  rel={isExternal ? "noopener noreferrer" : undefined}
                                  className="text-primary hover:underline"
                                  onClick={() => {
                                    if (isMail)
                                      track("contact_click", {
                                        type: "email",
                                        location: "faqs_answer",
                                      });
                                    if (isTel)
                                      track("contact_click", {
                                        type: "phone",
                                        location: "faqs_answer",
                                      });
                                    if (isExternal)
                                      track("external_link_click", {
                                        location: "faqs_answer",
                                        href: href ?? "",
                                      });
                                  }}
                                >
                                  {children}
                                </a>
                              );
                            },
                            blockquote: ({ children }) => (
                              <div className="bg-card border border-border rounded-lg p-4 my-4">
                                <div className="[&>p]:m-0">{children}</div>
                              </div>
                            ),
                          }}
                        >
                          {it.aMarkdown}
                        </ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card className="p-6">
                <div className="text-muted-foreground">
                  No results for{" "}
                  <span className="text-foreground font-medium">
                    “{query.trim()}”
                  </span>
                  . Try another keyword.
                </div>
              </Card>
            )}

            {/* CTA */}
            <Card className="p-6 border border-primary/20 bg-primary/10">
              <div className="space-y-3">
                <div className="text-xl font-semibold text-foreground">
                  Still need help?
                </div>
                <div className="text-muted-foreground">
                  If your question isn’t answered above, contact our team and we’ll help straight away.
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+441158244244"
                    className="inline-flex"
                    onClick={() =>
                      track("contact_click", {
                        type: "phone",
                        location: "faqs_cta",
                      })
                    }
                  >
                    <Button className="gap-2 w-full sm:w-auto">
                      <Phone className="w-4 h-4" />
                      Call 0115 8 244 244
                    </Button>
                  </a>

                  <a
                    href="mailto:bookings@cloudcarsltd.com"
                    className="inline-flex"
                    onClick={() =>
                      track("contact_click", {
                        type: "email",
                        location: "faqs_cta",
                      })
                    }
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      Email bookings@cloudcarsltd.com
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Tip for admin:</span> In CMS, format
              each FAQ question as a heading like{" "}
              <code>## How do I book?</code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
