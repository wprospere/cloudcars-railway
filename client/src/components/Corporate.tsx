import React, { useMemo, useState } from "react";
import { useCmsContent } from "@/hooks/useCmsContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Headphones,
  FileText,
  CheckCircle2,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

const benefits = [
  {
    icon: CreditCard,
    title: "Clear Pricing",
    description: "No surprises. Fixed rates agreed upfront so you can budget properly.",
  },
  {
    icon: FileText,
    title: "One Monthly Bill",
    description: "All your trips on one invoice with full breakdown. Makes expenses easy.",
  },
  {
    icon: Users,
    title: "Team Booking",
    description: "Your staff book directly. You set the rules, we handle the rest.",
  },
  {
    icon: BarChart3,
    title: "See Everything",
    description: "Full reports on who's travelling where and what it's costing.",
  },
  {
    icon: Headphones,
    title: "Direct Line",
    description: "Your own account manager who actually picks up the phone.",
  },
  {
    icon: Building2,
    title: "Nottingham Based",
    description: "We're here, we know the area, and we're not going anywhere.",
  },
];

type Partner = { name: string; logo: string };

// ✅ Fallback partners (used if CMS not set / invalid)
const FALLBACK_PARTNERS: Partner[] = [
  { name: "Boots UK", logo: "/partners/boots.png" },
  { name: "Speedo", logo: "/partners/speedo.png" },
  { name: "Nottinghamshire Healthcare Trust", logo: "/partners/nhs-nottinghamshire.png" },
];

function safeParseJson(input: unknown): any | null {
  if (typeof input !== "string") return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function sanitizePartners(raw: any): Partner[] {
  const arr = raw?.partners;
  if (!Array.isArray(arr)) return [];
  const cleaned: Partner[] = [];

  for (const item of arr) {
    const name = item?.name;
    const logo = item?.logo;
    if (!isNonEmptyString(name) || !isNonEmptyString(logo)) continue;
    cleaned.push({ name: name.trim(), logo: logo.trim() });
  }

  // Deduplicate by name
  const seen = new Set<string>();
  return cleaned.filter((p) => {
    const key = p.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function Corporate() {
  const content = useCmsContent("corporate");

  // ✅ CMS controlled partners (logos only)
  // Create this CMS section in admin: sectionKey = "corporate_partners"
  // Store JSON in extraData: { "partners": [ { "name": "...", "logo": "..." } ] }
  const partnersContent = useCmsContent("corporate_partners");

  const partners = useMemo(() => {
    const parsed = safeParseJson(partnersContent?.extraData);
    const fromCms = sanitizePartners(parsed);
    return fromCms.length > 0 ? fromCms : FALLBACK_PARTNERS;
  }, [partnersContent?.extraData]);

  // ✅ Track which partner logos failed to load so we can show the name instead
  const [logoFailed, setLogoFailed] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    estimatedMonthlyTrips: "",
    requirements: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      toast.success("Thanks! We'll give you a call within 24 hours.");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
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

  return (
    <section id="corporate" className="py-20 lg:py-32">
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

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {content.description}
            </p>

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

            {/* ✅ Trusted Partners (CMS Controlled) */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Trusted partners
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A selection of organisations we support with corporate transport.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <BadgeCheck className="w-4 h-4" />
                  Verified
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-stretch">
                {partners.map((p) => {
                  const failed = !!logoFailed[p.name];

                  return (
                    <div
                      key={p.name}
                      className="relative overflow-hidden rounded-xl border border-border bg-card px-4 py-6 flex items-center justify-center transition hover:shadow-sm"
                      title={p.name}
                      aria-label={p.name}
                    >
                      {/* badge */}
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
                        <BadgeCheck className="w-3 h-3" />
                        Trusted partner
                      </div>

                      {/* Logo */}
                      {!failed && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.logo}
                          alt={`${p.name} logo`}
                          className="max-h-10 w-auto object-contain opacity-90"
                          loading="lazy"
                          onError={() => {
                            setLogoFailed((prev) => ({ ...prev, [p.name]: true }));
                          }}
                        />
                      )}

                      {/* Fallback name if logo doesn't render */}
                      {failed && (
                        <div className="px-3 text-center">
                          <span className="text-sm font-medium text-foreground">
                            {p.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ✅ IMPORTANT: do NOT show this on live site */}
              {process.env.NODE_ENV !== "production" && (
                <div className="mt-4 text-xs text-muted-foreground">
                  To add or update logos, edit CMS section:{" "}
                  <span className="font-medium">corporate_partners</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Got It!
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Thanks for getting in touch. Someone from our team will call you
                  within 24 hours to chat about what you need.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Let's Talk Business
                </h3>
                <p className="text-muted-foreground mb-6">
                  Tell us a bit about your company and we'll put together a
                  package that works for you.
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
                        placeholder="0115 123 4567"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedMonthlyTrips">
                      Roughly How Many Trips Per Month?
                    </Label>
                    <Input
                      id="estimatedMonthlyTrips"
                      name="estimatedMonthlyTrips"
                      value={formData.estimatedMonthlyTrips}
                      onChange={handleChange}
                      placeholder="e.g., 50-100 trips"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">What Do You Need?</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Airport runs, staff transport, client pickups..."
                      rows={4}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Get in Touch"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
