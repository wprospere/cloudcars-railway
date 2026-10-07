import { ArrowLeft, Phone } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

import PolicyDocument from "@/components/PolicyDocument";
import PageMeta from "@/components/PageMeta";

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

// The CMS markdown carries its own title, "Last updated" line and "Questions?"
// block, which this page already renders itself — drop them to avoid duplicates.
function cleanTermsMarkdown(md: string) {
  let out = md.trim();

  out = out.replace(/^#\s*Terms\s*(&|and)\s*Conditions\s*\n+/i, "");
  out = out.replace(/^[_*]*Last updated:[^\n]*\n+/i, "");

  const m = out.match(/\n(?:-{3,}\s*\n+)?#{1,6}\s*Questions\?\s*\n[\s\S]*$/i);
  if (m && m[0].length < 700) out = out.slice(0, m.index).trimEnd();

  return out;
}

function TermsLoading() {
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

export default function Terms() {
  const { data, isLoading, error } = trpc.cms.getPolicyDoc.useQuery(
    { slug: "terms" },
    { staleTime: 60_000 }
  );

  if (isLoading) return <TermsLoading />;

  const title = data?.title?.trim() || "Terms & Conditions";
  const lastUpdated = formatDate(data?.lastUpdated) || "2024"; // fallback until set in CMS
  const markdown = cleanTermsMarkdown(data?.markdown ?? "");

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Terms & Conditions | Cloud Cars"
        description="Read the Cloud Cars terms and conditions covering account and non-account bookings, waiting time, cancellations, pricing and liability."
        path="/terms"
      />
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-card border-b border-border">
          <div className="container py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
              onClick={() =>
                track("nav_click", { location: "terms_hero", to: "home_link" })
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
        {markdown.trim() ? (
          <PolicyDocument markdown={markdown} location="terms_markdown">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 md:p-8">
              <h2 className="mb-2 text-xl font-bold text-foreground md:text-2xl">Questions?</h2>
              <p className="mb-4 text-muted-foreground">
                If you have any questions about these terms and conditions, please contact us:
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <a
                  href="tel:+441158244244"
                  className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                  onClick={() =>
                    track("contact_click", { type: "phone", location: "terms_questions" })
                  }
                >
                  <Phone className="w-4 h-4" />
                  Call Us: 0115 8 244 244
                </a>

                <a
                  href="mailto:info@cloudcarsltd.com"
                  className="font-medium text-primary hover:underline"
                  onClick={() =>
                    track("contact_click", { type: "email", location: "terms_questions" })
                  }
                >
                  Email: info@cloudcarsltd.com
                </a>
              </div>
            </div>
          </PolicyDocument>
        ) : (
          <div className="container py-12">
            <div className="mx-auto max-w-4xl rounded-lg border border-border bg-card/50 p-6">
              <p className="m-0 leading-relaxed text-muted-foreground">
                Terms content is not yet set in the CMS.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
