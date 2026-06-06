import { useState, useEffect, useRef } from "react";
import { useCmsContent } from "@/hooks/useCmsContent";

// Cloudflare Turnstile site key (public — safe to expose in the client).
// The matching SECRET key lives only on the server in /api/corporate-inquiry.
// For Vite this comes from import.meta.env.VITE_TURNSTILE_SITE_KEY.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  ShieldCheck,
  Leaf,
  FileText,
  BarChart3,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Benefits reflect what Cloud Cars actually offers to account clients today:
 *  - consolidated invoicing with a choice of cycle (weekly / fortnightly / monthly)
 *  - journey visibility for account clients
 *  - book-on-behalf-of staff/guests
 *  - DBS-checked, licensed drivers
 *  - owned fleet
 *  - hybrid/eco fleet (ESG)
 */
const benefits = [
  {
    icon: Building2,
    title: "A Fleet We Own & Run",
    description:
      "One of the few Nottingham firms to own its own fleet — that means consistency, accountability, and a single point of contact, not a rota of strangers.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted, Licensed Drivers",
    description:
      "Every driver is DBS-checked, licensed by Nottingham City Council, and fully insured — duty of care covered when you put a colleague or client in one of our vehicles.",
  },
  {
    icon: Users,
    title: "Book on Behalf of Staff & Guests",
    description:
      "A nominated person in your team can arrange travel for staff, visitors, clients, and hotel guests in seconds.",
  },
  {
    icon: FileText,
    title: "Flexible Consolidated Invoicing",
    description:
      "All journeys on one clear invoice — weekly, fortnightly, or monthly — with a full breakdown for your finance team and easy expenses reconciliation.",
  },
  {
    icon: BarChart3,
    title: "Full Journey Visibility",
    description:
      "Log in to review journey history, costs, and routes for every trip. Downloadable records make it straightforward for your finance or travel team.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Hybrid Fleet",
    description:
      "Nottingham's first environmentally conscious taxi company. Lower-emission journeys that support your organisation's sustainability reporting.",
  },
];

const faqs = [
  {
    q: "How do I open a business account?",
    a: "Fill in the short form on this page or call us on 0115 8 244 244. Once your account is approved, your nominated bookers can start arranging travel straight away.",
  },
  {
    q: "Who can book once we have an account?",
    a: "Any team members you nominate can book on behalf of staff, clients, visitors, and guests.",
  },
  {
    q: "How does billing work?",
    a: "Account clients receive one consolidated invoice covering all journeys, with a full breakdown. You choose the cycle that suits your finance team — weekly, fortnightly, or monthly.",
  },
  {
    q: "Which airports do you cover?",
    a: "East Midlands, Birmingham, Manchester, Heathrow, and all major UK airports, plus stations and event venues across the East Midlands.",
  },
  {
    q: "Are your drivers vetted?",
    a: "Yes. Every driver is DBS-checked, licensed by Nottingham City Council, and carries full liability insurance — so your duty of care obligations are covered whenever you put a colleague or client in one of our vehicles.",
  },
];

export default function Corporate() {
  const content = useCmsContent("corporate");

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    estimatedMonthlyTrips: "",
    requirements: "",
    // Honeypot: a real user never fills this (it is visually hidden).
    // Bots that fill every field will populate it, and the server rejects those.
    company_website: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Cloudflare Turnstile token + widget management
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Load the Turnstile script once.
    const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);

    const renderWidget = () => {
      if (
        window.turnstile &&
        turnstileRef.current &&
        widgetIdRef.current === null
      ) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    } else {
      script.addEventListener("load", renderWidget);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    if (!turnstileToken) {
      toast.error("Please complete the verification before submitting.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const data = await res.json().catch(() => ({}));

      // Server returns { ok: boolean, error?: string }
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      toast.success("Thanks! We'll give you a call within 24 hours.");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
      // Token is single-use; reset the widget so the user can retry.
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FAQPage structured data — helps Google show rich results for "corporate taxi Nottingham" queries.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="corporate" className="py-20 lg:py-32">
      {/* Structured data for SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Business Accounts
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {content.title}{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                {content.subtitle}
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {content.description}
            </p>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
              <h3 className="text-base font-semibold text-foreground mb-2">
                The accountable alternative to app-based transport
              </h3>
              <p className="text-sm text-muted-foreground leading-6">
                When a driver cancels at 5am before a key client's airport run,
                no app will take responsibility. Cloud Cars gives you a named
                account, a direct number, and a team you can hold to account —
                consistent drivers, consistent standards, every time.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Serving Nottingham since 2012
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> DBS-checked drivers
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Owned & operated fleet
              </span>
            </div>

            {/* Prefer a real anchor for the phone CTA so it is crawlable + tappable on mobile */}
            <p className="text-sm text-muted-foreground">
              Prefer to talk it through?{" "}
              <a
                href="tel:01158244244"
                className="font-semibold text-primary hover:underline"
              >
                Call our team on 0115 8 244 244
              </a>
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Enquiry Received
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Thanks for getting in touch. A member of our team will contact
                  you within 24 hours to discuss your business transport needs.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Open a Business Account
                </h3>
                <p className="text-muted-foreground mb-2">
                  Tell us a little about your organisation and the type of
                  journeys you need.
                </p>
                <p className="text-sm text-primary font-medium mb-6">
                  Suitable for staff travel, airport runs, hotel guests, visitor
                  transport, and repeat bookings.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        autoComplete="organization"
                        placeholder="Your company"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="email@company.com"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                        placeholder="0115 123 4567"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedMonthlyTrips">
                      Estimated Monthly Journeys
                    </Label>
                    <Input
                      id="estimatedMonthlyTrips"
                      name="estimatedMonthlyTrips"
                      value={formData.estimatedMonthlyTrips}
                      onChange={handleChange}
                      placeholder="e.g. 20, 50-100, or ad hoc"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Your Requirements</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Tell us about staff transport, airport runs, client collections, hotel guest travel, regular routes, or any specific requirements..."
                      rows={4}
                      className="bg-background resize-none"
                    />
                  </div>

                  {/* Honeypot — hidden from real users, attractive to bots.
                      aria-hidden + tabIndex -1 keep it away from screen readers and keyboard. */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  >
                    <label htmlFor="company_website">
                      Company website (leave blank)
                    </label>
                    <input
                      id="company_website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.company_website}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Cloudflare Turnstile widget */}
                  <div ref={turnstileRef} className="flex justify-center" />

                  <p className="text-xs text-center text-muted-foreground">
                    Trusted by businesses across Nottingham since 2012
                  </p>
                  <Button
                    type="submit"
                    disabled={isSending || !turnstileToken}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Request a Call Back"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-1">
                    No obligation. We'll be in touch within 24 hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ — visible content backing the FAQPage schema above */}
        <div className="mt-20 lg:mt-28 max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Business account questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-card p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground list-none">
                  {faq.q}
                  <span className="ml-4 text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-6">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
