import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";
import { AREAS, sharedAreaFaqs } from "@/lib/areaContent";
import { EMA_FROM } from "@shared/airportFares";
import { CalendarCheck, Car, MapPin, PlaneTakeoff } from "lucide-react";

interface TaxiAreaProps {
  area: string;
}

export default function TaxiArea({ area }: TaxiAreaProps) {
  const content = AREAS[area];
  const slug = `taxi-${area.toLowerCase().replace(/\s/g, "-")}`;
  const faqs = [
    ...(content?.faqs ?? []),
    ...sharedAreaFaqs(area, EMA_FROM),
  ];

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
    <PageLayout>
      <PageMeta path={`/${slug}`} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Local Taxi"
        title={`Taxi ${area}`}
        description={`Cloud Cars provides reliable taxi services in ${area} for local journeys, airport transfers, business travel and pre-booked transport across Nottingham.`}
        ctaLabel="Book a Taxi"
        icon={Car}
        tagline={`Your local ${area} taxi, done properly.`}
        highlight={area}
        image="/nottingham-council-house.jpg"
        imageClassName="origin-left scale-[1.3] object-[50%_40%]"
        reassurances={["Fixed price agreed at booking","Friendly local drivers","Available round the clock","Comfortable saloon cars"]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">

          <div className="grid md:grid-cols-3 gap-6 mb-14">

            <FeatureCard
              icon={MapPin}
              title={`Local Taxi ${area}`}
              text={`Dependable taxi journeys within ${area} and surrounding Nottingham neighbourhoods.`}
            />

            <FeatureCard
              icon={PlaneTakeoff}
              title="Airport Transfers"
              text={`Airport transport from ${area} to East Midlands Airport, Birmingham Airport and other major UK airports.`}
            />

            <FeatureCard
              icon={CalendarCheck}
              title="Pre Booked Travel"
              text={`Book your journey in advance for reliable collections and professional service.`}
            />

          </div>

          {content ? (
            <>
              <section className="mb-14">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  Taxis in {area}
                </h2>
                <div className="space-y-4 text-muted-foreground max-w-3xl">
                  {content.intro.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>

              <section className="mb-14">
                <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                  {content.journeysHeading}
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {content.journeys.map((j) => (
                    <div
                      key={j.title}
                      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                    >
                      <h3 className="font-semibold text-foreground mb-2">
                        {j.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {j.text}
                      </p>
                      {j.href ? (
                        <Link href={j.href}>
                          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                            {j.hrefLabel ?? "Find out more"} →
                          </a>
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-14 rounded-2xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold mb-4">Nearby areas we cover</h2>
                <p className="text-muted-foreground mb-5 max-w-3xl">
                  We pick up right across Nottingham and the surrounding
                  suburbs. If you are travelling from a neighbouring area, see
                  its page too.
                </p>
                <div className="flex flex-wrap gap-3">
                  {content.nearby.map((name) => (
                    <Link
                      key={name}
                      href={`/taxi-${name.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <a className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary">
                        <MapPin className="h-4 w-4 text-primary" />
                        Taxi {name}
                      </a>
                    </Link>
                  ))}
                  <Link href="/taxi-nottingham">
                    <a className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary">
                      <Car className="h-4 w-4 text-primary" />
                      Taxi Nottingham
                    </a>
                  </Link>
                  <Link href="/airport-transfers-nottingham">
                    <a className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary">
                      <PlaneTakeoff className="h-4 w-4 text-primary" />
                      Airport transfers
                    </a>
                  </Link>
                </div>
              </section>
            </>
          ) : null}

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              {area} taxi questions
            </h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border bg-card p-8 text-center">

            <h2 className="text-2xl font-bold mb-4">
              Book a taxi in {area}
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book your taxi with Cloud Cars for reliable service,
              professional drivers and comfortable vehicles across {area}
              and the wider Nottingham area.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
            </Button>

          </div>

        </div>
      </section>
    </PageLayout>
  );
}
