import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TaxiNottingham() {
  return (
    <>
      <Helmet>
        <title>Taxi Nottingham | Cloud Cars</title>

        <meta
          name="description"
          content="Reliable taxi service in Nottingham for local journeys, airport transfers, corporate travel and pre-booked transport. Book with Cloud Cars today."
        />

        <link
          rel="canonical"
          href="https://cloudcarsltd.com/taxi-nottingham"
        />
      </Helmet>

      <main className="min-h-screen bg-background">

        {/* HERO */}
        <section className="py-16 lg:py-24">
          <div className="container max-w-5xl">

            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Cloud Cars Nottingham
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Taxi Service in Nottingham
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              Cloud Cars provides dependable taxi services across Nottingham for
              everyday travel, business journeys, local appointments, station
              runs and pre-booked transport you can rely on.
            </p>

            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Taxi
              </a>
            </Button>

          </div>
        </section>

        {/* FEATURES */}
        <section className="pb-16">
          <div className="container max-w-5xl">

            <div className="grid md:grid-cols-3 gap-6 mb-12">

              <div className="rounded-2xl border p-6 bg-card">
                <h2 className="text-xl font-semibold mb-3">
                  Local Journeys
                </h2>

                <p className="text-muted-foreground">
                  Quick and reliable transport across Nottingham and surrounding
                  areas including Beeston, Arnold, West Bridgford and Mapperley.
                </p>
              </div>

              <div className="rounded-2xl border p-6 bg-card">
                <h2 className="text-xl font-semibold mb-3">
                  Pre-Booked Travel
                </h2>

                <p className="text-muted-foreground">
                  Book ahead for peace of mind with professional drivers and
                  transparent pricing for longer journeys.
                </p>
              </div>

              <div className="rounded-2xl border p-6 bg-card">
                <h2 className="text-xl font-semibold mb-3">
                  Professional Service
                </h2>

                <p className="text-muted-foreground">
                  Clean vehicles, experienced drivers and dependable customer
                  support for every journey.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* OTHER SERVICES */}
        <section className="pb-20">
          <div className="container max-w-5xl">

            <h2 className="text-3xl font-bold mb-6">
              Other Services from Cloud Cars
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <Link href="/airport-transfers-nottingham">
                <a className="border rounded-xl p-6 hover:border-primary transition">
                  <h3 className="font-semibold text-lg mb-2">
                    Airport Transfers
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Reliable airport transfers from Nottingham to East Midlands,
                    Birmingham, Heathrow and all UK airports.
                  </p>
                </a>
              </Link>

              <Link href="/executive-car-nottingham">
                <a className="border rounded-xl p-6 hover:border-primary transition">
                  <h3 className="font-semibold text-lg mb-2">
                    Executive Car Service
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Premium executive travel for business meetings, corporate
                    transport and special occasions.
                  </p>
                </a>
              </Link>

              <Link href="/7-seater-taxi-nottingham">
                <a className="border rounded-xl p-6 hover:border-primary transition">
                  <h3 className="font-semibold text-lg mb-2">
                    7 Seater Taxi
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Ideal for families, airport groups and larger journeys
                    across Nottingham and beyond.
                  </p>
                </a>
              </Link>

              <Link href="/courier-services-nottingham">
                <a className="border rounded-xl p-6 hover:border-primary transition">
                  <h3 className="font-semibold text-lg mb-2">
                    Courier Services
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Fast and reliable same-day courier deliveries across
                    Nottingham and surrounding areas.
                  </p>
                </a>
              </Link>

            </div>

          </div>
        </section>

        {/* WHY CLOUD CARS */}
        <section className="pb-24">
          <div className="container max-w-5xl">

            <div className="rounded-2xl border p-8 bg-card">

              <h2 className="text-2xl font-bold mb-4">
                Why choose Cloud Cars?
              </h2>

              <ul className="space-y-3 text-muted-foreground">

                <li>Reliable local Nottingham taxi service</li>

                <li>Airport transfers and long-distance journeys available</li>

                <li>Corporate transport and business accounts supported</li>

                <li>Standard, executive and larger vehicle options</li>

                <li>Friendly drivers and professional service</li>

              </ul>

            </div>

          </div>
        </section>

      </main>
    </>
  );
}