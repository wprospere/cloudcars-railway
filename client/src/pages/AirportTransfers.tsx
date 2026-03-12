import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

const airportRoutes = [
  {
    airport: "East Midlands Airport",
    standard: "£40",
    executive: "£70",
    xl: "£75",
  },
  {
    airport: "Birmingham Airport",
    standard: "£110",
    executive: "£160",
    xl: "£170",
  },
  {
    airport: "Manchester Airport",
    standard: "£150",
    executive: "£210",
    xl: "£220",
  },
  {
    airport: "Heathrow Airport",
    standard: "£260",
    executive: "£330",
    xl: "£360",
  },
];

const faqs = [
  {
    question: "How much is a taxi from Nottingham to East Midlands Airport?",
    answer:
      "Guide prices for airport transfers from Nottingham to East Midlands Airport start from £40 for a standard vehicle. Final prices may vary depending on pickup location, time of travel and vehicle type.",
  },
  {
    question: "Do you offer Heathrow airport transfers from Nottingham?",
    answer:
      "Yes. Cloud Cars provides pre-booked airport transfers from Nottingham to Heathrow Airport, as well as Birmingham, Manchester and East Midlands Airport.",
  },
  {
    question: "Can I pre-book an early morning airport transfer?",
    answer:
      "Yes. We recommend pre-booking early morning and late-night airport journeys so your driver and vehicle are arranged in advance.",
  },
  {
    question: "Do you provide larger vehicles for airport travel?",
    answer:
      "Yes. We can provide larger vehicles for families, groups and passengers travelling with extra luggage. Please ask when booking.",
  },
];

export default function AirportTransfers() {
  return (
    <PageLayout>
      <Helmet>
        <title>
          Airport Transfers Nottingham | Nottingham Airport Taxi | Cloud Cars
        </title>
        <meta
          name="description"
          content="Book reliable airport transfers in Nottingham with Cloud Cars. Fixed quotes for East Midlands, Birmingham, Manchester and Heathrow Airport. Professional drivers, 24/7 pre-booked airport taxi service."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/airport-transfers-nottingham"
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Airport Travel"
        title="Airport Transfers Nottingham"
        description="Cloud Cars provides reliable airport transfers from Nottingham to all major UK airports. Whether you are travelling for business, a family holiday, or an early morning flight, our professional drivers help you travel comfortably and on time."
        ctaLabel="Book an Airport Transfer"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/7-seater-taxi-nottingham">
                <a>Need a Larger Vehicle?</a>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/nottingham-to-east-midlands-airport">
                <a>Taxi to East Midlands Airport</a>
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <FeatureCard
              title="Pre-Booked Reliability"
              text="Plan your airport transfer in advance with dependable collection times and professional service from your door to the terminal."
            />
            <FeatureCard
              title="Fixed Quoted Pricing"
              text="Clear, competitive quoted pricing for popular airport taxi routes from Nottingham and surrounding areas."
            />
            <FeatureCard
              title="Vehicle Options"
              text="Choose from standard, executive and larger vehicle options for solo travellers, families, business clients and groups."
            />
          </div>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Nottingham airport transfers to major UK airports
            </h2>

            <div className="space-y-4 text-muted-foreground max-w-4xl">
              <p>
                Cloud Cars provides pre-booked airport transfers from Nottingham
                to major UK airports including East Midlands Airport, Birmingham
                Airport, Manchester Airport and Heathrow Airport. Whether you
                need a local airport taxi, a long-distance airport transfer, or
                a larger vehicle for family travel, we aim to provide a reliable
                and comfortable journey.
              </p>

              <p>
                Our Nottingham airport taxi service is suitable for business
                travellers, family holidays, group travel and passengers with
                extra luggage. Pre-booking helps ensure your driver arrives on
                time and your journey is planned around your flight and pickup
                requirements.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Popular airport routes
            </h2>

            <p className="text-muted-foreground mb-6 max-w-3xl">
              Below are guide prices for some of our most popular airport
              transfer routes from Nottingham. Final pricing may vary depending
              on pickup location, time of travel, waiting time, parking, and
              vehicle type.
            </p>

            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="p-4 text-left font-semibold">Airport</th>
                    <th className="p-4 text-left font-semibold">Standard</th>
                    <th className="p-4 text-left font-semibold">Executive</th>
                    <th className="p-4 text-left font-semibold">
                      Larger Vehicle
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {airportRoutes.map((route) => (
                    <tr
                      key={route.airport}
                      className="border-b last:border-b-0"
                    >
                      <td className="p-4 font-medium text-foreground">
                        {route.airport}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {route.standard}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {route.executive}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {route.xl}
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
                Ideal for all types of airport travel
              </h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Business and corporate airport transfers</li>
                <li>Family holiday travel with luggage</li>
                <li>Early morning and late-night departures</li>
                <li>UK airport pickups and drop-offs</li>
                <li>Group airport journeys with larger vehicles available</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">Why choose Cloud Cars?</h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Pre-booked airport journeys from Nottingham</li>
                <li>Professional drivers and reliable collection times</li>
                <li>Standard, executive and larger vehicle options</li>
                <li>Competitive pricing for major UK airport routes</li>
                <li>Suitable for individuals, families and business travellers</li>
              </ul>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Airports we regularly cover
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  East Midlands Airport transfers
                </h3>
                <p>
                  East Midlands Airport is one of our most popular airport taxi
                  routes from Nottingham. If you need a taxi from Nottingham to
                  East Midlands Airport, Cloud Cars provides reliable pre-booked
                  journeys with professional drivers and comfortable vehicles.
                </p>

                <div className="mt-4">
                  <Link href="/nottingham-to-east-midlands-airport">
                    <a className="text-primary hover:underline font-medium">
                      View Nottingham to East Midlands Airport taxi page
                    </a>
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Birmingham Airport transfers
                </h3>
                <p>
                  We provide reliable Nottingham to Birmingham Airport taxi
                  journeys for business travel, holidays and early departures.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Manchester Airport transfers
                </h3>
                <p>
                  For longer airport journeys, Cloud Cars offers comfortable
                  travel options with standard, executive and larger vehicle
                  choices.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Heathrow Airport transfers
                </h3>
                <p>
                  If you need a taxi from Nottingham to Heathrow, we offer
                  pre-booked long-distance airport transfers designed for a
                  dependable start to your journey.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Related Cloud Cars services
            </h2>

            <div className="space-y-4">
              <Link href="/nottingham-to-east-midlands-airport">
                <a className="block rounded-xl border p-4 hover:border-primary transition">
                  <h3 className="font-semibold mb-1">
                    Taxi to East Midlands Airport
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Book a direct taxi from Nottingham to East Midlands Airport
                    with fixed quoted pricing and dependable pickup times.
                  </p>
                </a>
              </Link>

              <Link href="/executive-car-nottingham">
                <a className="block rounded-xl border p-4 hover:border-primary transition">
                  <h3 className="font-semibold mb-1">Executive Car Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium airport travel for business clients and special
                    journeys.
                  </p>
                </a>
              </Link>

              <Link href="/7-seater-taxi-nottingham">
                <a className="block rounded-xl border p-4 hover:border-primary transition">
                  <h3 className="font-semibold mb-1">7 Seater Taxi</h3>
                  <p className="text-sm text-muted-foreground">
                    Great for families, groups and extra luggage on airport
                    runs.
                  </p>
                </a>
              </Link>

              <Link href="/corporate-transport-nottingham">
                <a className="block rounded-xl border p-4 hover:border-primary transition">
                  <h3 className="font-semibold mb-1">Corporate Transport</h3>
                  <p className="text-sm text-muted-foreground">
                    Reliable transport solutions for companies, staff and
                    business travel.
                  </p>
                </a>
              </Link>
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
              Book your Nottingham airport transfer
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book your airport transfer with Cloud Cars for dependable service,
              professional drivers and competitive quoted pricing from
              Nottingham and surrounding areas.
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