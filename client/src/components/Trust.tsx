import { useMemo, useState } from "react";
import {
  Shield,
  Award,
  MapPin,
  Users,
  Clock,
  Leaf,
  Star,
  PoundSterling,
  Heart,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { GOOGLE_REVIEWS_URL } from "@/const";

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
  { value: "14+", label: "Years in Nottingham" },
  { value: "100K+", label: "Journeys Completed" },
  { value: "24/7", label: "Always Available" },
  { value: "97%", label: "On-Time Arrivals" },
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
    <section className="section-light bg-background py-20 lg:py-32">
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
            We set out to be the best private hire firm in Nottingham, not the
            biggest. That means drivers who know the city, turn up early and
            treat every passenger as a person, not a pickup.
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

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <PoundSterling className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Know your fare before you travel
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The price you see when you book is the price you pay. Your fare is
              fixed at booking. It only changes if you change the journey, for
              example by adding a stop or keeping the driver waiting.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              No surprise surge. Busy-time pricing is already in the fare
              you&apos;re shown before you book.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Technology can book a journey. People make the difference.
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Our drivers don&apos;t simply move a vehicle from A to B.
              They&apos;ll help with your luggage, meet you in airport arrivals,
              wait when you&apos;re delayed and, where appropriate, make sure you
              reach the place you&apos;re going safely and comfortably.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cloud Cars believes professional drivers have a future because
              great transport will always need a human touch.
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed">
          Apps are good at matching a car to a booking. They can&apos;t carry a
          suitcase, wait for a delayed flight or notice that a passenger needs a
          hand. We use technology to make booking easy. We rely on people to make
          the journey good.
        </p>

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

        {/* Review prompt. Only quote real reviews here, word for word, with permission. */}
        <div className="mb-16 flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Travelled with us recently?
          </h3>
          <p className="max-w-xl text-muted-foreground">
            Tell other people in Nottingham how it went. A quick Google review
            helps us and helps them choose.
          </p>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Leave a Google review
          </a>
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