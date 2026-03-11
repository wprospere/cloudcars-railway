import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

const executiveRoutes = [
  {
    journey: "East Midlands Airport",
    from: "£70",
  },
  {
    journey: "Birmingham Airport",
    from: "£160",
  },
  {
    journey: "Manchester Airport",
    from: "£210",
  },
  {
    journey: "Heathrow Airport",
    from: "£330",
  },
];

export default function ExecutiveCar() {
  return (
    <PageLayout>
      <Helmet>
        <title>Executive Car Service Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Executive car service in Nottingham for business travel, airport transfers and professional transport with premium vehicles and experienced drivers."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/executive-car-nottingham"
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Executive Travel"
        title="Executive Car Service Nottingham"
        description="Cloud Cars offers executive travel in Nottingham for business travel, airport transfers and professional transport requirements. Travel in comfort with premium vehicles and experienced drivers."
        ctaLabel="Book Executive Travel"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <FeatureCard
              title="Professional Image"
              text="A polished and dependable transport option for meetings, clients, airport travel and business appointments."
            />
            <FeatureCard
              title="Premium Comfort"
              text="Executive vehicles with a quieter, more refined journey for longer trips and important travel."
            />
            <FeatureCard
              title="Reliable Pre-Booking"
              text="Ideal for planned journeys where timing, presentation and service quality matter."
            />
          </div>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Executive vehicle options
              </h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Mercedes E Class</li>
                <li>Audi A6</li>
                <li>Premium executive saloons</li>
                <li>Airport and long-distance travel</li>
                <li>Corporate and professional bookings</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ideal for executive travel
              </h2>

              <p className="text-muted-foreground mb-4">
                Executive transport is ideal when you want a more refined travel
                experience for business appointments, client collections,
                airport journeys and important events.
              </p>

              <p className="text-muted-foreground mb-6">
                Cloud Cars helps you travel in comfort with a professional
                service that reflects well on you and your business.
              </p>

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/corporate-transport-nottingham">
                  <a>View Corporate Transport</a>
                </Link>
              </Button>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Typical Executive Pricing
            </h2>

            <p className="text-muted-foreground mb-6 max-w-3xl">
              Below are guide prices for some popular executive journeys.
              Final pricing may vary depending on pickup location, waiting time,
              parking, and booking requirements.
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
                  {executiveRoutes.map((route) => (
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
                      Reliable airport transport from Nottingham to major UK
                      airports.
                    </p>
                  </a>
                </Link>

                <Link href="/corporate-transport-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Corporate Transport</h3>
                    <p className="text-sm text-muted-foreground">
                      Business transport solutions for staff, clients and
                      account work.
                    </p>
                  </a>
                </Link>

                <Link href="/taxi-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Taxi Nottingham</h3>
                    <p className="text-sm text-muted-foreground">
                      Reliable everyday transport across Nottingham and
                      surrounding areas.
                    </p>
                  </a>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Executive travel with Cloud Cars
              </h2>

              <p className="text-muted-foreground mb-4">
                Book executive transport with Cloud Cars for reliable,
                professional and comfortable travel across Nottingham and
                beyond.
              </p>

              <p className="text-muted-foreground">
                Whether you are travelling to the airport, heading to a meeting,
                or arranging transport for a client, our executive service is
                designed to deliver a higher standard of journey.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-8 lg:p-10 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Book executive travel in Nottingham
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book your executive car with Cloud Cars for premium comfort,
              professional service and dependable pre-booked travel.
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