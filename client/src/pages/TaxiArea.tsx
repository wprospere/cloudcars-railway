import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

interface TaxiAreaProps {
  area: string;
}

export default function TaxiArea({ area }: TaxiAreaProps) {
  return (
    <PageLayout>
      <Helmet>
        <title>Taxi {area} | Cloud Cars</title>

        <meta
          name="description"
          content={`Reliable taxi service in ${area} with Cloud Cars. Local journeys, airport transfers, executive travel and corporate transport from ${area} to Nottingham and surrounding areas.`}
        />

        <link
          rel="canonical"
          href={`https://cloudcarsltd.com/taxi-${area
            .toLowerCase()
            .replace(/\s/g, "-")}`}
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Local Taxi"
        title={`Taxi ${area}`}
        description={`Cloud Cars provides reliable taxi services in ${area} for local journeys, airport transfers, business travel and pre-booked transport across Nottingham.`}
        ctaLabel="Book a Taxi"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">

          <div className="grid md:grid-cols-3 gap-6 mb-14">

            <FeatureCard
              title={`Local Taxi ${area}`}
              text={`Dependable taxi journeys within ${area} and surrounding Nottingham neighbourhoods.`}
            />

            <FeatureCard
              title="Airport Transfers"
              text={`Airport transport from ${area} to East Midlands Airport, Birmingham Airport and other major UK airports.`}
            />

            <FeatureCard
              title="Pre Booked Travel"
              text={`Book your journey in advance for reliable collections and professional service.`}
            />

          </div>

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