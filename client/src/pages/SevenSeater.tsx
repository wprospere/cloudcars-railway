import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

const sevenSeaterRoutes = [
  {
    journey: "East Midlands Airport",
    from: "£75",
  },
  {
    journey: "Birmingham Airport",
    from: "£170",
  },
  {
    journey: "Manchester Airport",
    from: "£220",
  },
  {
    journey: "Heathrow Airport",
    from: "£360",
  },
];

export default function SevenSeater() {
  return (
    <PageLayout>
      <Helmet>
        <title>7 Seater Taxi Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Spacious 7 seater taxi service in Nottingham for airport transfers, family travel, group bookings and corporate journeys with Cloud Cars."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/7-seater-taxi-nottingham"
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Group Travel"
        title="7 Seater Taxi Nottingham"
        description="Cloud Cars provides spacious 7 seater transport in Nottingham for airport transfers, family travel, group bookings and corporate journeys. Ideal when you need extra passenger space or more room for luggage."
        ctaLabel="Book a 7 Seater"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <FeatureCard
              title="Ideal for Families"
              text="Perfect for family airport runs, day trips and journeys where you need more passenger space."
            />
            <FeatureCard
              title="Extra Luggage Space"
              text="A practical option for airport transfers, shopping trips and bookings with extra bags or equipment."
            />
            <FeatureCard
              title="Group Travel"
              text="Ideal for business teams, event travel and group bookings across Nottingham and beyond."
            />
          </div>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">Ideal for</h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Airport transfers</li>
                <li>Family travel</li>
                <li>Business teams</li>
                <li>Extra luggage</li>
                <li>Group journeys and special occasions</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Why choose a 7 seater?
              </h2>

              <p className="text-muted-foreground mb-4">
                A 7 seater gives you more flexibility than a standard taxi when
                travelling with family, colleagues or additional luggage. It is
                especially useful for airport transfers and longer-distance
                journeys where comfort and space matter.
              </p>

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/airport-transfers-nottingham">
                  <a>See Airport Transfers</a>
                </Link>
              </Button>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Typical 7 Seater Pricing
            </h2>

            <p className="text-muted-foreground mb-6 max-w-3xl">
              Below are guide prices for some popular 7 seater airport journeys.
              Final pricing may vary depending on pickup location, waiting time,
              parking, and exact vehicle availability at the time of booking.
            </p>

            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="p-4 text-left font-semibold">Journey</th>
                    <th className="p-4 text-left font-semibold">From</th>
                  </tr>
                </thead>

                <tbody>
                  {sevenSeaterRoutes.map((route) => (
                    <tr
                      key={route.journey}
                      className="border-b last:border-b-0"
                    >
                      <td className="p-4 font-medium text-foreground">
                        {route.journey}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {route.from}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Prices shown are guide prices only and may be subject to change.
              Please confirm your quote at the time of booking.
            </p>
          </section>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Related Cloud Cars services
              </h2>

              <div className="space-y-4">
                <Link href="/airport-transfers-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Airport Transfers</h3>
                    <p className="text-sm text-muted-foreground">
                      Reliable airport travel from Nottingham to major UK
                      airports.
                    </p>
                  </a>
                </Link>

                <Link href="/executive-car-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Executive Car Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium transport for business travel and special
                      occasions.
                    </p>
                  </a>
                </Link>

                <Link href="/corporate-transport-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Corporate Transport</h3>
                    <p className="text-sm text-muted-foreground">
                      Business transport solutions for staff, teams and company
                      accounts.
                    </p>
                  </a>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Spacious and dependable travel
              </h2>

              <p className="text-muted-foreground mb-4">
                Our 7 seater vehicles are ideal for group travel with comfort,
                space and dependable service from Cloud Cars. Whether you are
                heading to the airport, travelling with children, or booking for
                a team journey, we help make the trip easier.
              </p>

              <p className="text-muted-foreground">
                Pre-booking is recommended for larger vehicle journeys to help
                ensure availability and the best service for your travel needs.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-8 lg:p-10 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Book your 7 seater in Nottingham
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book your 7 seater with Cloud Cars for comfortable group travel,
              airport transfers and dependable pre-booked journeys in
              Nottingham.
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