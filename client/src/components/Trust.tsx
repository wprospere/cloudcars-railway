import { useMemo } from "react";
import { Shield, Award, MapPin, Users, Clock, Leaf } from "lucide-react";

// ✅ Pull images from CMS (partner-logo-1..4 etc.)
import { trpc } from "@/lib/trpc";

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

export default function Trust() {
  // ✅ This endpoint returns: { json: Array(5), meta: {...} }
  const imagesQuery = trpc.cms.getAllImages.useQuery();

  const imagesArray = useMemo(() => {
    const d: any = imagesQuery.data;
    const arr = d?.json ?? d; // handle both {json:[...]} and direct array
    return Array.isArray(arr) ? arr : [];
  }, [imagesQuery.data]);

  const imagesByKey = useMemo(() => {
    const map = new Map<string, any>();
    for (const row of imagesArray) {
      if (row?.imageKey) map.set(String(row.imageKey), row);
    }
    return map;
  }, [imagesArray]);

  const partnerLogos = useMemo(() => {
    const keys = ["partner-logo-1", "partner-logo-2", "partner-logo-3", "partner-logo-4"];
    return keys
      .map((k) => {
        const row = imagesByKey.get(k);
        return row?.url ? { key: k, url: row.url, alt: row?.altText ?? k } : null;
      })
      .filter(Boolean) as { key: string; url: string; alt: string }[];
  }, [imagesByKey]);

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
            Nottingham's been trusting us with their journeys for over a decade.
            Here's why they keep coming back.
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

        {/* ✅ Trusted partners logos (from CMS) */}
        <div className="mt-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Trusted partners</h3>
              <p className="text-sm text-muted-foreground">
                Organisations we support with corporate transport.
              </p>
            </div>

            {imagesQuery.isLoading && (
              <div className="text-sm text-muted-foreground">Loading logos…</div>
            )}
          </div>

          {partnerLogos.length === 0 ? (
            <div className="bg-card rounded-xl p-6 border border-border text-sm text-muted-foreground">
              No partner logos uploaded yet. (Upload to <b>partner-logo-1</b> … <b>partner-logo-4</b> in Admin → Manage Images)
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {partnerLogos.map((logo) => (
                <div
                  key={logo.key}
                  className="bg-card rounded-xl p-4 border border-border flex items-center justify-center"
                >
                  <img
                    src={logo.url}
                    alt={logo.alt}
                    className="max-h-12 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
