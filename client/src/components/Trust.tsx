import { useMemo, useState } from "react";
import { Shield, Award, MapPin, Users, Clock, Leaf } from "lucide-react";
import { trpc } from "@/lib/trpc";

const trustItems = [
  {
    icon: Shield,
    title: "Licensed & Fully Covered",
    description:
      "Every driver holds a Nottingham City Council licence and full insurance. Enhanced DBS checks are standard, because safety always comes first.",
  },
  {
    icon: Award,
    title: "Professional Service",
    description:
      "Clean vehicles, polite drivers, and dependable standards on every journey. We believe the small details make a big difference.",
  },
  {
    icon: MapPin,
    title: "We Know Nottingham",
    description:
      "Our drivers know the city properly — from main routes to local roads, traffic patterns, and the areas that matter most to our customers.",
  },
  {
    icon: Users,
    title: "Personally Selected Drivers",
    description:
      "Our drivers are not simply accepted through an online sign-up. They are carefully selected by our team, with documents checked properly and standards reviewed before they represent Cloud Cars.",
  },
  {
    icon: Clock,
    title: "On Time, Every Time",
    description:
      "We understand how important time matters. Our drivers arrive when expected, and passengers can stay informed throughout the journey.",
  },
  {
    icon: Leaf,
    title: "Going Greener",
    description:
      "We are growing our hybrid and electric fleet year by year, helping deliver a cleaner and more sustainable service across Nottingham.",
  },
];

const stats = [
  { value: "12+", label: "Years in Nottingham" },
  { value: "100K+", label: "Journeys Completed" },
  { value: "24/7", label: "Always Available" },
  { value: "99%", label: "On-Time Arrivals" },
];

export default function Trust() {
  const imagesQuery = trpc.cms.getAllImages.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const imageMap = useMemo(() => {
    const map: Record<string, string> = {};
    const imgs = imagesQuery.data;

    if (!Array.isArray(imgs)) return map;

    for (const img of imgs) {
      if (img?.imageKey && img?.url) {
        map[String(img.imageKey)] = String(img.url);
      }
    }

    return map;
  }, [imagesQuery.data]);

  const partnerLogoKeys = [
    "partner-logo-1",
    "partner-logo-2",
    "partner-logo-3",
    "partner-logo-4",
  ];

  const partnerLogos = useMemo(() => {
    const urls = partnerLogoKeys
      .map((k) => imageMap[k])
      .filter((u): u is string => typeof u === "string" && u.length > 5);

    return urls.filter((u) => !failed[u]);
  }, [imageMap, failed]);

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
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
            Nottingham has trusted Cloud Cars for years because we focus on
            safety, professionalism, reliability, and drivers chosen with care.
          </p>
        </div>

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
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

        {partnerLogos.length > 0 && (
          <div className="pt-8 border-t border-border">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Trusted partners</h3>
              <p className="text-sm text-muted-foreground">
                Organisations we support with corporate transport.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partnerLogos.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="bg-card rounded-xl p-6 border border-border flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`Trusted partner ${idx + 1}`}
                    className="max-h-16 object-contain"
                    loading="lazy"
                    onError={() =>
                      setFailed((prev) => ({
                        ...prev,
                        [url]: true,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}