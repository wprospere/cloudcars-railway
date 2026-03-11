import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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

export default function AirportTransfers() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Airport Transfers Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Reliable airport transfers from Nottingham to East Midlands, Birmingham, Manchester and Heathrow Airport. Pre-booked journeys, professional drivers and fixed quoted pricing."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/airport-transfers-nottingham"
        />
      </Helmet>

      <Header />

      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Cloud Cars Airport Travel
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Airport Transfers Nottingham
            </h1>

            <p className="text-lg text-muted-foreground max-w-3xl mb-8">
              Cloud Cars provides reliable airport transfers from Nottingham to
              all major UK airports. Whether you are travelling for business, a
              family holiday, or an early morning flight, our professional
              drivers help you travel comfortably and on time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a
                  href="https://book.cloudcarsltd.com/portal/#/booking"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book an Airport Transfer
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/7-seater-taxi-nottingham">
                  <a>Need a Larger Vehicle?</a>
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-14">
              <div className="rounded-2xl border bg-card p-6">
                <h2 className="text-xl font-semibold mb-3">Pre-Booked Reliability</h2>
                <p className="text-muted-foreground">
                  Plan your journey in advance with dependable collection times
                  and professional service from door to terminal.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h2 className="text-xl font-semibold mb-3">Fixed Quoted Pricing</h2>
                <p className="text-muted-foreground">
                  Clear, competitive pricing for popular airport routes from
                  Nottingham and surrounding areas.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h2 className="text-xl font-semibold mb-3">Vehicle Options</h2>
                <p className="text-muted-foreground">
                  Choose from standard, executive and larger vehicle options for
                  individuals, families and groups.
                </p>
              </div>
            </div>

            <section className="mb-14">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Popular Airport Routes
              </h2>

              <p className="text-muted-foreground mb-6 max-w-3xl">
                Below are guide prices for some of our most popular airport
                transfer routes from Nottingham. Final pricing may vary
                depending on pickup location, time of travel, waiting time,
                parking, and vehicle type.
              </p>

              <div className="overflow-x-auto rounded-2xl border bg-card">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="p-4 text-left font-semibold">Airport</th>
                      <th className="p-4 text-left font-semibold">Standard</th>
                      <th className="p-4 text-left font-semibold">Executive</th>
                      <th className="p-4 text-left font-semibold">XL</th>
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
                <h2 className="text-2xl font-bold mb-4">
                  Related Cloud Cars services
                </h2>

                <div className="space-y-4">
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
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-8 lg:p-10 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Book your Nottingham airport transfer
              </h2>

              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Book your airport transfer with Cloud Cars for dependable
                service, professional drivers and competitive quoted pricing
                from Nottingham and surrounding areas.
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
      </main>

      <Footer />
    </div>
  );
}