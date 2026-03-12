import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

export default function EastMidlandsAirportTaxi() {
  return (
    <PageLayout>
      <Helmet>
        <title>
          Taxi to East Midlands Airport | Nottingham Airport Transfers | Cloud Cars
        </title>

        <meta
          name="description"
          content="Taxi to East Midlands Airport from Nottingham with Cloud Cars. Reliable airport transfers, fixed prices and professional drivers for early morning and late night flights."
        />

        <link
          rel="canonical"
          href="https://cloudcarsltd.com/east-midlands-airport-taxi"
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Airport Transfers"
        title="Taxi to East Midlands Airport"
        description="Cloud Cars provides reliable taxi transfers from Nottingham to East Midlands Airport with professional drivers, comfortable vehicles and dependable pickup times."
        ctaLabel="Book Airport Taxi"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">

          <div className="grid md:grid-cols-3 gap-6 mb-14">

            <FeatureCard
              title="Reliable Airport Transfers"
              text="Pre-booked airport transport from Nottingham to East Midlands Airport with dependable collection times."
            />

            <FeatureCard
              title="Early Morning Flights"
              text="Perfect for early departures and late night arrivals with drivers available 24/7."
            />

            <FeatureCard
              title="Flight Tracking"
              text="We monitor flight arrivals so pickups are timed correctly when collecting passengers."
            />

          </div>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">

            <div className="rounded-2xl border bg-card p-8">

              <h2 className="text-2xl font-bold mb-4">
                Nottingham to East Midlands Airport Taxi
              </h2>

              <p className="text-muted-foreground mb-4">
                East Midlands Airport is the closest airport to Nottingham and
                a popular choice for both business and holiday travel.
              </p>

              <p className="text-muted-foreground mb-4">
                Cloud Cars provides reliable taxi transport from Nottingham,
                West Bridgford, Beeston, Wollaton, Edwalton and surrounding
                areas directly to the airport terminal.
              </p>

              <p className="text-muted-foreground">
                Pre-booking ensures your driver arrives on time so you can
                travel to the airport without stress.
              </p>

            </div>

            <div className="rounded-2xl border bg-card p-8">

              <h2 className="text-2xl font-bold mb-4">
                Why book your airport taxi with Cloud Cars?
              </h2>

              <ul className="space-y-3 text-muted-foreground">

                <li>Professional local drivers</li>
                <li>Comfortable clean vehicles</li>
                <li>Reliable pickup times</li>
                <li>Pre-booked airport journeys</li>
                <li>Coverage across Nottingham</li>

              </ul>

            </div>

          </section>

          <section className="rounded-2xl border bg-card p-8 lg:p-10 text-center">

            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Book your East Midlands Airport taxi
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book your airport transfer with Cloud Cars for dependable
              service, professional drivers and comfortable travel from
              Nottingham to East Midlands Airport.
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

          </section>

        </div>
      </section>
    </PageLayout>
  );
}