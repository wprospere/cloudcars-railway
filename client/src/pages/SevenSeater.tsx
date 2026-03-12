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

const faqs = [
  {
    question: "Do you provide 7 seater taxis in Nottingham?",
    answer:
      "Yes. Cloud Cars provides 7 seater taxi services in Nottingham for airport transfers, family journeys, group bookings, business travel and trips where extra luggage space is needed.",
  },
  {
    question: "Is a 7 seater suitable for airport transfers?",
    answer:
      "Yes. A 7 seater is ideal for airport transfers when travelling as a family or group, especially when extra luggage space is needed.",
  },
  {
    question: "Can I pre-book a larger vehicle?",
    answer:
      "Yes. Pre-booking is recommended for 7 seater and larger vehicle journeys to help ensure availability and the right vehicle for your booking.",
  },
  {
    question: "Do you offer 7 seater travel for business teams and events?",
    answer:
      "Yes. Our 7 seater service is suitable for business teams, event travel, staff transport and group travel across Nottingham and beyond.",
  },
];

export default function SevenSeater() {
  return (
    <PageLayout>
      <Helmet>
        <title>
          7 Seater Taxi Nottingham | Group & Family Travel | Cloud Cars
        </title>
        <meta
          name="description"
          content="Book a 7 seater taxi in Nottingham with Cloud Cars. Ideal for airport transfers, family travel, group bookings, business teams and journeys with extra luggage."
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

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Spacious 7 seater travel in Nottingham
            </h2>

            <div className="space-y-4 text-muted-foreground max-w-4xl">
              <p>
                Cloud Cars provides 7 seater taxi travel in Nottingham for
                customers who need more passenger space, more luggage room or a
                more practical option for group journeys. Whether you are
                travelling to the airport, heading out as a family, arranging
                transport for a business team or planning a special occasion, a
                7 seater can make the journey easier and more comfortable.
              </p>

              <p>
                Our 7 seater service is especially popular for airport
                transfers, longer-distance journeys, family travel and group
                bookings where a standard car may not offer enough room.
                Pre-booking helps us arrange the right vehicle for your travel
                needs.
              </p>
            </div>
          </section>

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

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              When a larger vehicle is the better option
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Family airport travel
                </h3>
                <p>
                  A 7 seater is often the best choice for family airport
                  transfers when passengers need extra room for suitcases,
                  hand luggage, pushchairs or holiday bags.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Group journeys
                </h3>
                <p>
                  Travelling together is often more convenient than splitting
                  into multiple vehicles, especially for events, outings and
                  social trips.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Business teams
                </h3>
                <p>
                  A larger vehicle can be a practical choice for staff travel,
                  team transport, event attendance and shared business journeys.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Longer-distance comfort
                </h3>
                <p>
                  When travelling further afield, the extra space in a 7 seater
                  can make the journey more comfortable for both passengers and
                  luggage.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Typical 7 seater pricing
            </h2>

            <p className="text-muted-foreground mb-6 max-w-3xl">
              Below are guide prices for some popular 7 seater airport journeys
              from Nottingham. Final pricing may vary depending on pickup
              location, waiting time, parking, and exact vehicle availability at
              the time of booking.
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

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              Frequently asked questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
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