import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  Shield,
  Award,
  MapPin,
  Users,
  Clock,
  Leaf,
  CheckCircle2,
} from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Licensed & Covered",
    description:
      "Every driver holds a Nottingham City Council licence and full insurance. Enhanced DBS checks are standard - your safety comes first.",
  },
  {
    icon: Award,
    title: "Proper British Service",
    description:
      "We do things right. Turn up on time, keep the car clean, be polite. It's not complicated, but it makes all the difference.",
  },
  {
    icon: MapPin,
    title: "We Know Nottingham",
    description:
      "Our drivers live and breathe this city. Back streets, shortcuts, traffic patterns - local knowledge that gets you there faster.",
  },
  {
    icon: Users,
    title: "Drivers You Can Trust",
    description:
      "We're picky about who drives for us. Every driver is vetted, trained, and genuinely cares about giving you a good journey.",
  },
  {
    icon: Clock,
    title: "On Time, Every Time",
    description:
      "We know you've got places to be. Our drivers arrive when they say they will, and you can track them on the way.",
  },
  {
    icon: Leaf,
    title: "Going Greener",
    description:
      "We're adding more hybrid and electric cars to our fleet every year. Better for Nottingham, better for everyone.",
  },
];

const stats = [
  { value: "12+", label: "Years in Nottingham" },
  { value: "100K+", label: "Journeys Completed" },
  { value: "24/7", label: "Always Available" },
  { value: "99%", label: "On-Time Arrivals" },
];

function normalizeArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    for (const key of ["items", "data", "rows", "results", "images"]) {
      const v = (value as any)[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

/**
 * These are the most common imageKey patterns used for the 4 partner slots.
 * Your admin might store them as:
 * - partner_logo_1..4
 * - trusted_partner_1..4
 * - partner1..4
 */
const PARTNER_KEY_CANDIDATES: string[][] = [
  ["partner_logo_1", "trusted_partner_1", "partner1", "trustedPartner1", "partnerLogo1"],
  ["partner_logo_2", "trusted_partner_2", "partner2", "trustedPartner2", "partnerLogo2"],
  ["partner_logo_3", "trusted_partner_3", "partner3", "trustedPartner3", "partnerLogo3"],
  ["partner_logo_4", "trusted_partner_4", "partner4", "trustedPartner4", "partnerLogo4"],
];

export default function Trust() {
  // Pull ALL CMS images (includes partner logos)
  const imagesQuery = trpc.cms.getAllImages.useQuery();
  const images = normalizeArray<any>(imagesQuery.data);

  const partnerUrls = useMemo(() => {
    const byKey = new Map<string, string>();

    for (const img of images) {
      const k = img?.imageKey;
      const u = img?.url;
      if (k && u) byKey.set(String(k), String(u));
    }

    return PARTNER_KEY_CANDIDATES.map((candidates) => {
      for (const key of candidates) {
        const url = byKey.get(key);
        if (url) return url;
      }
      return null;
    });
  }, [images]);

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Why Cloud Cars
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            What Makes Us{" "}
            <span className="text-gradient-green font-['Playfair_Display',serif] italic">
              Different
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Nottingham&apos;s been trusting us with their journeys for over a decade.
            Here&apos;s why they keep coming back.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-gradient-green mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* ---------------- Trusted Partners Logos ---------------- */}
        <div className="mt-16">
          <div className="flex items-center justify-between gap-4 mb-6 flex-col sm:flex-row">
            <div>
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                Trusted partners
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-2">
                Organisations we support
              </h3>
              <p className="text-muted-foreground mt-2">
                A selection of organisations we support with corporate transport.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Verified
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {partnerUrls.map((url, idx) => (
              <div
                key={idx}
                className="h-24 rounded-xl border border-border bg-card flex items-center justify-center p-4"
              >
                {url ? (
                  <img
                    src={url}
                    alt={`Trusted Partner ${idx + 1}`}
                    className="max-h-12 max-w-full object-contain opacity-90 hover:opacity-100 transition"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No logo uploaded
                  </span>
                )}
              </div>
            ))}
          </div>

          {imagesQuery.isError && (
            <p className="text-sm text-destructive mt-4">
              Could not load partner logos (CMS image query failed).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
