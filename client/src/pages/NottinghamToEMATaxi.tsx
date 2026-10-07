import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Clock,
  MapPin,
  PlaneLanding,
  PlaneTakeoff,
  PoundSterling,
  ShieldCheck,
} from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";

const journeyFacts = [
  { icon: PoundSterling, text: "Guide price from £40" },
  { icon: Clock, text: "Approx journey time: 30 minutes" },
  { icon: ShieldCheck, text: "Professional licensed drivers" },
  { icon: PlaneTakeoff, text: "24/7 pre-booked airport transfers" },
  { icon: PlaneLanding, text: "Flight tracking available" },
];

const areas = [
  { name: "Beeston", href: "/taxi-beeston" },
  { name: "West Bridgford", href: "/taxi-west-bridgford" },
  { name: "Wollaton", href: "/taxi-wollaton" },
  { name: "Edwalton", href: "/taxi-edwalton" },
];

const related = [
  { label: "Airport Transfers Nottingham", href: "/airport-transfers-nottingham" },
  { label: "Taxi Nottingham", href: "/taxi-nottingham" },
  { label: "7 Seater Airport Taxi", href: "/7-seater-taxi-nottingham" },
];

export default function NottinghamToEMATaxi() {
  return (
    <PageLayout>
      <Helmet>
        <title>
          Taxi Nottingham to East Midlands Airport | £40 Airport Transfer | Cloud Cars
        </title>

        <meta
          name="description"
          content="Taxi from Nottingham to East Midlands Airport from £40. Reliable 24/7 airport transfers covering Beeston, West Bridgford, Wollaton and Edwalton with Cloud Cars."
        />

        <link
          rel="canonical"
          href="https://cloudcarsltd.com/nottingham-to-east-midlands-airport"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: "Cloud Cars",
            areaServed: [
              "Nottingham",
              "Beeston",
              "West Bridgford",
              "Wollaton",
              "Edwalton"
            ],
            serviceType: "Airport Transfer",
            provider: {
              "@type": "LocalBusiness",
              name: "Cloud Cars"
            }
          })}
        </script>
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Airport Transfers"
        title="Taxi from Nottingham to East Midlands Airport"
        highlight="East Midlands Airport"
        icon={PlaneTakeoff}
        tagline="Straight to the terminal, stress-free."
        description="Cloud Cars provides reliable taxi transfers from Nottingham to East Midlands Airport (EMA). Whether you're travelling for business or a family holiday, our professional drivers ensure you arrive at the airport comfortably and on time."
        ctaLabel="Book Your Airport Taxi"
        image="/airport-plane.webp"
        imageClassName="origin-left scale-[1.3] object-[50%_35%]"
        reassurances={[
          "Guide price from £40",
          "About 30 minutes",
          "Available 24/7",
          "Flight tracking available",
        ]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-4xl">
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            Our airport taxis operate 24 hours a day and can be booked in
            advance for early morning departures, late-night flights and
            scheduled airport journeys.
          </p>

          <div className="mb-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-foreground">
              Nottingham → East Midlands Airport Taxi
            </h2>

            <ul className="space-y-4">
              {journeyFacts.map((fact) => (
                <li key={fact.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <fact.icon className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-muted-foreground">{fact.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Areas we cover for EMA airport taxis
          </h2>

          <p className="mb-6 text-muted-foreground">
            We provide airport taxi transfers to East Midlands Airport from
            across Nottingham including:
          </p>

          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            {areas.map((area) => (
              <Link key={area.href} href={area.href}>
                <a className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow-md">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-medium text-foreground">
                    Taxi {area.name} → East Midlands Airport
                  </span>
                </a>
              </Link>
            ))}
          </div>

          <div className="mb-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Your Airport Taxi
              </a>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Related taxi services
            </h2>

            <div className="space-y-3">
              {related.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className="block text-primary hover:underline">
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
