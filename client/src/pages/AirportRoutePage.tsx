import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import { AIRPORT_PAGES, AIRPORT_ORDER } from "@/lib/airportContent";
import { AIRPORT_FARES, fromPrice } from "@shared/airportFares";
import {
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock,
  Phone,
  PlaneLanding,
  PlaneTakeoff,
  PoundSterling,
} from "lucide-react";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

const areas = [
  { name: "Beeston", href: "/taxi-beeston" },
  { name: "West Bridgford", href: "/taxi-west-bridgford" },
  { name: "Wollaton", href: "/taxi-wollaton" },
  { name: "Edwalton", href: "/taxi-edwalton" },
];

export default function AirportRoutePage({ airport }: { airport: string }) {
  const content = AIRPORT_PAGES[airport];
  const fare = AIRPORT_FARES.find((f) => f.airport === content?.fareKey);
  if (!content || !fare) return null;

  const path = `/${content.slug}`;
  const standardFrom = fromPrice(fare.standard);

  const faqs = [
    ...content.faqs,
    {
      q: `How much is a taxi from Nottingham to ${content.name}?`,
      a: `Guide prices start ${standardFrom.toLowerCase()} for a standard vehicle, ${fromPrice(fare.xl).toLowerCase()} for a larger vehicle and ${fromPrice(fare.executive).toLowerCase()} for an executive vehicle, one way from inside the Nottingham ring road. Airport pickup and drop-off fees are built into the price you see when you book, and your fixed price is confirmed before you travel. Final prices may vary with pickup location, time of travel and vehicle type.`,
    },
    {
      q: "Is my fare fixed?",
      a: "Yes. Your fare is fixed when you book. It only changes if you change the journey, for example by adding a stop or keeping the driver waiting beyond the 30 minutes included on airport pickups.",
    },
    {
      q: "Can I book a larger or executive vehicle?",
      a: "Yes. Ask for a larger vehicle for families, groups and extra luggage, or an executive vehicle for business travel, when you book.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      name: "Cloud Cars",
      serviceType: `Airport transfer from Nottingham to ${content.name}`,
      areaServed: ["Nottingham", "Beeston", "West Bridgford", "Wollaton", "Edwalton"],
      provider: { "@type": "LocalBusiness", name: "Cloud Cars" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const otherAirports = [
    { label: "East Midlands Airport", href: "/nottingham-to-east-midlands-airport" },
    ...AIRPORT_ORDER.filter((k) => k !== airport).map((k) => ({
      label: AIRPORT_PAGES[k].name,
      href: `/${AIRPORT_PAGES[k].slug}`,
    })),
  ];

  const facts = [
    { icon: PoundSterling, text: `Guide price ${standardFrom.toLowerCase()}, one way` },
    { icon: Clock, text: content.journeyTime },
    ...(content.terminals
      ? [{ icon: PlaneTakeoff, text: content.terminals }]
      : []),
    { icon: CheckCircle2, text: "30 minutes' waiting included on every airport pickup" },
    { icon: PlaneLanding, text: "We track your flight and meet you in arrivals" },
  ];

  return (
    <PageLayout>
      <PageMeta path={path} />
      <Helmet>
        {jsonLd.map((block, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(block)}
          </script>
        ))}
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Airport Transfers"
        title={`Taxi from Nottingham to ${content.name}`}
        highlight={content.name}
        icon={PlaneTakeoff}
        tagline="Door to terminal, with your fare fixed at booking."
        description={`Pre-booked taxi transfers from Nottingham to ${content.name}, with a professional driver, your fare fixed when you book and your flight tracked for arrivals.`}
        ctaLabel="Book Your Airport Taxi"
        image="/airport-plane.webp"
        imageClassName="origin-left scale-[1.3] object-[50%_35%]"
        reassurances={[
          "Fixed price agreed at booking",
          `Guide price ${standardFrom.toLowerCase()}`,
          "30 minutes' waiting included",
          "Available 24/7",
        ]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <section className="mb-14 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-muted-foreground">
              <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                Nottingham to {content.name}
              </h2>
              {content.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold text-foreground">
                Journey at a glance
              </h2>
              <ul className="space-y-4">
                {facts.map((fact) => (
                  <li key={fact.text} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <fact.icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-muted-foreground">{fact.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">
              Guide prices
            </h2>
            <p className="mb-6 max-w-3xl text-muted-foreground">
              One way from inside the Nottingham ring road. Airport pickup and
              drop-off fees are built into the price you see when you book, and
              your fixed price is confirmed before you travel. Final prices may
              vary with pickup location, time of travel and vehicle type.
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { label: "Standard", price: fare.standard },
                { label: "Larger vehicle", price: fare.xl },
                { label: "Executive", price: fare.executive },
              ].map((v) => (
                <div
                  key={v.label}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{v.label}</p>
                  <p className="text-3xl font-bold text-primary">
                    {fromPrice(v.price)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
              {content.planningHeading}
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {content.planning.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <h3 className="mb-2 font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              How booking works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: CalendarCheck,
                  title: "1. Book",
                  text: "Tell us your pickup address, your flight number and the date. Your fare is fixed at booking.",
                },
                {
                  icon: PlaneTakeoff,
                  title: "2. We track your flight",
                  text: "Give us your flight number and we track it, so a delay or an early landing does not catch us out.",
                },
                {
                  icon: PlaneLanding,
                  title: "3. We meet you",
                  text: "For arrivals we meet you in arrivals and wait if your flight is late. Thirty minutes' waiting is included.",
                },
              ].map((step) => (
                <div key={step.title}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14 rounded-2xl border border-primary/20 bg-primary/5 p-8">
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Book your return journey too
            </h2>
            <p className="max-w-3xl text-muted-foreground">
              You can book your outward and return journeys together. Tell us
              your flight details, pickup address and number of passengers, and
              your arrival pickup is arranged in advance, so there is a driver
              waiting when you land.
            </p>
          </section>

          <section className="mb-14 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Where we collect from
            </h2>
            <p className="mb-5 max-w-3xl text-muted-foreground">
              We pick up right across Nottingham, including:
            </p>
            <div className="flex flex-wrap gap-3">
              {areas.map((a) => (
                <Link key={a.href} href={a.href}>
                  <a className="inline-flex items-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary">
                    Taxi {a.name}
                  </a>
                </Link>
              ))}
              <Link href="/taxi-nottingham">
                <a className="inline-flex items-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary">
                  Taxi Nottingham
                </a>
              </Link>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
              {content.name} taxi questions
            </h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="mb-2 font-semibold text-foreground">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Other airport transfers and related services
            </h2>
            <div className="space-y-3">
              {otherAirports.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className="block text-primary hover:underline">
                    Nottingham to {item.label}
                  </a>
                </Link>
              ))}
              <Link href="/airport-transfers-nottingham">
                <a className="block text-primary hover:underline">
                  All airport transfers from Nottingham
                </a>
              </Link>
              <Link href="/corporate-transport-nottingham">
                <a className="block text-primary hover:underline">
                  Corporate transport and business accounts
                </a>
              </Link>
              <Link href="/executive-car-nottingham">
                <a className="block text-primary hover:underline">
                  Executive car service
                </a>
              </Link>
            </div>
          </section>

          <div className="rounded-2xl border bg-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Book your {content.short} taxi
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Book online in a few minutes, or call us on 0115 8 244 244 to talk
              it through.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:01158244244">
                  <Phone className="mr-2 h-5 w-5" />
                  0115 8 244 244
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
