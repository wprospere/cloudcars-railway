import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PageLayout from "@/layouts/PageLayout";

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

      <section className="py-20 lg:py-28">
        <div className="container max-w-4xl">

          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Taxi from Nottingham to East Midlands Airport
          </h1>

          <p className="text-muted-foreground mb-6">
            Cloud Cars provides reliable taxi transfers from Nottingham to East
            Midlands Airport (EMA). Whether you're travelling for business or a
            family holiday, our professional drivers ensure you arrive at the
            airport comfortably and on time.
          </p>

          <p className="text-muted-foreground mb-8">
            Our airport taxis operate 24 hours a day and can be booked in
            advance for early morning departures, late-night flights and
            scheduled airport journeys.
          </p>

          <div className="bg-card border rounded-2xl p-8 mb-10">

            <h2 className="text-xl font-semibold mb-4">
              Nottingham → East Midlands Airport Taxi
            </h2>

            <ul className="space-y-2 text-muted-foreground">
              <li>Guide price from £40</li>
              <li>Approx journey time: 30 minutes</li>
              <li>Professional licensed drivers</li>
              <li>24/7 pre-booked airport transfers</li>
              <li>Flight tracking available</li>
            </ul>

          </div>

          <h2 className="text-2xl font-bold mb-4">
            Areas we cover for EMA airport taxis
          </h2>

          <p className="text-muted-foreground mb-6">
            We provide airport taxi transfers to East Midlands Airport from
            across Nottingham including:
          </p>

          <ul className="list-disc ml-6 text-muted-foreground mb-10 space-y-2">
            <li>Taxi Beeston → East Midlands Airport</li>
            <li>Taxi West Bridgford → East Midlands Airport</li>
            <li>Taxi Wollaton → East Midlands Airport</li>
            <li>Taxi Edwalton → East Midlands Airport</li>
          </ul>

          <div className="text-center mb-12">
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
                Book Your Airport Taxi
              </a>
            </Button>
          </div>

          <div className="border rounded-2xl p-8">

            <h2 className="text-xl font-semibold mb-4">
              Related taxi services
            </h2>

            <div className="space-y-3">

              <Link href="/airport-transfers-nottingham">
                <a className="block text-primary hover:underline">
                  Airport Transfers Nottingham
                </a>
              </Link>

              <Link href="/taxi-nottingham">
                <a className="block text-primary hover:underline">
                  Taxi Nottingham
                </a>
              </Link>

              <Link href="/7-seater-taxi-nottingham">
                <a className="block text-primary hover:underline">
                  7 Seater Airport Taxi
                </a>
              </Link>

            </div>

          </div>

        </div>
      </section>

    </PageLayout>
  );
}