import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

const faqs = [
  {
    question: "Do you provide taxi services across Nottingham?",
    answer:
      "Yes. Cloud Cars provides taxi services across Nottingham and surrounding areas for local travel, pre-booked journeys, business trips, station runs and airport transfers.",
  },
  {
    question: "Can I pre-book a taxi in Nottingham?",
    answer:
      "Yes. Pre-booking is recommended for airport transfers, business travel, early morning journeys and any trip where timing is especially important.",
  },
  {
    question: "Do you offer larger vehicles for group travel?",
    answer:
      "Yes. We can provide larger vehicles for families, groups and passengers travelling with extra luggage. Please ask when booking.",
  },
  {
    question: "Do you provide taxis for business and corporate travel?",
    answer:
      "Yes. Cloud Cars supports business and corporate travel across Nottingham, including staff travel, executive transport and pre-arranged account work.",
  },
];

export default function TaxiNottingham() {
  return (
    <PageLayout>
      <Helmet>
        <title>Taxi Nottingham | 24/7 Local Taxi Service | Cloud Cars</title>
        <meta
          name="description"
          content="Book a reliable taxi in Nottingham with Cloud Cars. Local journeys, business travel, airport transfers, station runs and pre-booked transport with professional drivers and clean vehicles."
        />
        <link rel="canonical" href="https://cloudcarsltd.com/taxi-nottingham" />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Nottingham"
        title="Taxi Service in Nottingham"
        description="Cloud Cars provides dependable taxi services across Nottingham for local journeys, business travel, appointments, station runs, airport transfers and pre-booked transport you can rely on."
        ctaLabel="Book a Taxi"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              title="Local Journeys"
              text="Reliable transport around Nottingham and surrounding areas for everyday travel, shopping, appointments and general local journeys."
            />
            <FeatureCard
              title="Pre-Booked Travel"
              text="Book ahead for peace of mind with dependable pickup times for business travel, airport transfers, station runs and important journeys."
            />
            <FeatureCard
              title="Professional Service"
              text="Clean vehicles, experienced drivers and dependable customer support for a smooth and comfortable taxi service."
            />
          </div>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Reliable taxi service across Nottingham
            </h2>

            <div className="space-y-4 text-muted-foreground max-w-4xl">
              <p>
                Cloud Cars provides taxi services in Nottingham for a wide range
                of travel needs, including local journeys, pre-booked transport,
                station runs, airport transfers and business travel. Whether you
                need a quick journey across the city or a longer planned trip,
                we aim to provide a reliable and professional service from
                pickup to drop-off.
              </p>

              <p>
                Our Nottingham taxi service is suitable for individuals,
                families, business travellers and groups who want dependable
                transport with clean vehicles and professional drivers. We also
                support customers who need transport arranged in advance for
                important appointments, work travel and time-sensitive journeys.
              </p>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Popular uses for our Nottingham taxi service
              </h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Local journeys across Nottingham</li>
                <li>Business and corporate travel</li>
                <li>Train station pickups and drop-offs</li>
                <li>Airport transfers and longer distance travel</li>
                <li>School runs, appointments and family transport</li>
                <li>Group travel with larger vehicle options available</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">Why choose Cloud Cars?</h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Dependable local taxi service in Nottingham</li>
                <li>Pre-booked transport for important journeys</li>
                <li>Professional drivers and clean vehicles</li>
                <li>Standard, executive and larger vehicle options</li>
                <li>Suitable for everyday, family and business travel</li>
              </ul>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Taxi journeys for everyday and business travel
            </h2>

            <div className="space-y-4 text-muted-foreground">
              <p>
                We support a wide range of transport needs across Nottingham,
                from everyday local taxi bookings to pre-arranged journeys for
                businesses and professional clients. If you need dependable
                transport for meetings, hotel pickups, staff travel, shopping
                trips, family outings or important appointments, Cloud Cars is
                here to help.
              </p>

              <p>
                For customers travelling further afield, we also provide
                pre-booked airport transfers and longer distance journeys from
                Nottingham. If you are travelling with extra luggage or as part
                of a larger group, larger vehicle options may also be available.
              </p>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              Related services
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/airport-transfers-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition block">
                  <h3 className="font-semibold mb-1">Airport Transfers</h3>
                  <p className="text-sm text-muted-foreground">
                    Pre-booked airport travel from Nottingham to major UK
                    airports.
                  </p>
                </a>
              </Link>

              <Link href="/executive-car-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition block">
                  <h3 className="font-semibold mb-1">Executive Car</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium travel for business clients and higher-end journeys.
                  </p>
                </a>
              </Link>

              <Link href="/7-seater-taxi-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition block">
                  <h3 className="font-semibold mb-1">7 Seater Taxi</h3>
                  <p className="text-sm text-muted-foreground">
                    Ideal for families, groups and passengers with extra
                    luggage.
                  </p>
                </a>
              </Link>

              <Link href="/courier-services-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition block">
                  <h3 className="font-semibold mb-1">Courier Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Reliable local courier and delivery support in Nottingham.
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
              Book your Nottingham taxi
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book with Cloud Cars for reliable taxi travel in Nottingham,
              whether you need a local journey, business travel, an airport
              transfer or pre-booked transport you can depend on.
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