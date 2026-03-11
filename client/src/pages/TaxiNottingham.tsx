import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

export default function TaxiNottingham() {
  return (
    <PageLayout>
      <Helmet>
        <title>Taxi Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Reliable taxi service in Nottingham for local journeys, business travel, airport transfers, and pre-booked transport with Cloud Cars."
        />
        <link rel="canonical" href="https://cloudcarsltd.com/taxi-nottingham" />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Nottingham"
        title="Taxi Service in Nottingham"
        description="Cloud Cars provides dependable taxi services across Nottingham for everyday travel, business journeys, local appointments, station runs and pre-booked transport you can rely on."
        ctaLabel="Book a Taxi"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              title="Local Journeys"
              text="Quick and reliable transport around Nottingham and surrounding areas."
            />
            <FeatureCard
              title="Pre-Booked Travel"
              text="Book ahead for peace of mind with fixed quoted pricing where applicable."
            />
            <FeatureCard
              title="Professional Service"
              text="Clean vehicles, experienced drivers, and dependable customer support."
            />
          </div>

          <div className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-bold mb-4">Related Services</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/airport-transfers-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition">
                  Airport Transfers
                </a>
              </Link>
              <Link href="/executive-car-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition">
                  Executive Car
                </a>
              </Link>
              <Link href="/7-seater-taxi-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition">
                  7 Seater Taxi
                </a>
              </Link>
              <Link href="/courier-services-nottingham">
                <a className="rounded-xl border p-4 hover:border-primary transition">
                  Courier Services
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}