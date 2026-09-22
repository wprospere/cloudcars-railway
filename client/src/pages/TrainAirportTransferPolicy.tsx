import { ArrowLeft, Phone } from "lucide-react";
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

  // ✅ Google Analytics 4 (gtag)
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

// Shown until a Cloud Cars admin edits this via Admin > Policies (slug "train-airport-transfer").
const DEFAULT_MARKDOWN = `
## Booking for a Train Departure

We know a missed train can throw off an entire journey, so we always aim to get you there in plenty of
time. To give yourself the best chance of a relaxed, stress-free journey, we recommend booking your
Cloud Cars pickup so you arrive at the station **at least 45 minutes to 1 hour before your scheduled
departure time**.

## Booking for a Flight Departure

Airport timings need a bit more of a buffer, since check-in and security take longer than boarding a
train. We recommend:

- **International flights** — arrive at the airport **at least 3 hours before departure**, to allow for
  check-in, security, and boarding procedures.
- **Domestic / UK flights** — arrive at the airport **at least 2 hours before departure**.

Let us know your flight time and airport when you book, and we'll work back from there to confirm a
pickup time that gives you a comfortable margin.

## Why We Recommend a Time Buffer

Traffic, roadworks, and weather can all affect journey times, even on routes our drivers know well, and
airport security queues can vary a lot depending on time of day. Building in a sensible buffer gives you
room to spare if anything doesn't go to plan, and means you're not sprinting for the platform or the gate.

## Our Commitment to You

Our drivers always aim to arrive on time and take the most efficient route available. However, Cloud Cars
cannot be held responsible for missed trains or flights caused by circumstances beyond our control,
including traffic delays, road closures, accidents, or adverse weather.

## What We Ask of You

Please let us know your train or flight departure time when you book, so we can plan your pickup time
accordingly. Our team is always happy to advise on a sensible pickup time for your journey — just ask
when booking.

Where a booking did not allow sufficient time to reach the station or airport before departure, or where
a delay was caused by factors outside our control, Cloud Cars is unable to offer compensation for a
missed train or flight.
`;

function TrainAirportTransferPolicyLoading() {
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
            {Array.from({ length: 4 }).map((_, i) => (
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

export default function TrainAirportTransferPolicy() {
  const { data, isLoading, error } = trpc.cms.getPolicyDoc.useQuery(
    { slug: "train-airport-transfer" },
    { staleTime: 60_000 }
  );

  if (isLoading) return <TrainAirportTransferPolicyLoading />;

  const title = data?.title?.trim() || "Train & Airport Transfer Policy";
  const lastUpdated = formatDate(data?.lastUpdated) || "2026"; // fallback until set in CMS
  const markdown = data?.markdown?.trim() || DEFAULT_MARKDOWN;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-card border-b border-border">
          <div className="container py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
              onClick={() =>
                track("nav_click", { location: "train_airport_transfer_hero", to: "home_link" })
              }
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2">Last updated: {lastUpdated}</p>

            {error && (
              <p className="text-sm text-destructive mt-3">
                Failed to load CMS policy content. Showing latest available content.
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto prose prose-invert prose-green">
            <div className="bg-card/50 border border-border rounded-lg p-6 mb-8">
              <p className="text-muted-foreground leading-relaxed m-0">
                This policy explains how we recommend timing a Cloud Cars booking ahead of a train or
                flight departure, and where our responsibility for missed connections begins and ends.
              </p>
            </div>

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
                ul: ({ children }) => <ul>{children}</ul>,
                li: ({ children }) => <li>{children}</li>,
                a: ({ href, children }) => {
                  const isMail = (href ?? "").startsWith("mailto:");
                  const isTel = (href ?? "").startsWith("tel:");
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
                        if (isMail) {
                          track("contact_click", {
                            type: "email",
                            location: "train_airport_transfer_markdown",
                          });
                          return;
                        }
                        if (isTel) {
                          track("contact_click", {
                            type: "phone",
                            location: "train_airport_transfer_markdown",
                          });
                          return;
                        }
                        if (isExternal) {
                          track("external_link_click", {
                            location: "train_airport_transfer_markdown",
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

            {/* Contact Section */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-12">
              <h3 className="text-primary mt-0">Booking a train or airport transfer?</h3>
              <p className="text-foreground mb-4">
                Let us know your departure time when you book and we'll help you plan the right pickup time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+441158244244"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  onClick={() =>
                    track("contact_click", { type: "phone", location: "train_airport_transfer_questions" })
                  }
                >
                  <Phone className="w-4 h-4" />
                  Call Us: 0115 8 244 244
                </a>

                <a
                  href="mailto:info@cloudcarsltd.com"
                  className="text-primary hover:text-primary/80 transition-colors"
                  onClick={() =>
                    track("contact_click", { type: "email", location: "train_airport_transfer_questions" })
                  }
                >
                  Email: info@cloudcarsltd.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
