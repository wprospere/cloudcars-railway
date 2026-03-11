import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

const courierPricing = [
  {
    element: "Base Fare",
    rate: "£10",
  },
  {
    element: "Per Mile",
    rate: "£2.20",
  },
  {
    element: "Per Minute",
    rate: "£0.20",
  },
  {
    element: "Minimum Fare",
    rate: "£15",
  },
];

export default function CourierServices() {
  return (
    <PageLayout>
      <Helmet>
        <title>Courier Services Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Reliable same-day courier services in Nottingham for parcels, business documents, hospital runs and urgent local deliveries with Cloud Cars."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/courier-services-nottingham"
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Courier Services"
        title="Courier Services Nottingham"
        description="Cloud Cars provides reliable same-day courier and parcel delivery services across Nottingham and surrounding areas for businesses, urgent deliveries and scheduled transport requirements."
        ctaLabel="Book a Courier"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <FeatureCard
              title="Same-Day Delivery"
              text="Fast local delivery support for urgent parcels, business items and scheduled courier jobs."
            />
            <FeatureCard
              title="Business Friendly"
              text="A dependable option for documents, regular account work and professional delivery requirements."
            />
            <FeatureCard
              title="Local & Regional Runs"
              text="Courier coverage across Nottingham and surrounding areas with practical delivery solutions."
            />
          </div>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Courier services include
              </h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Same-day parcel delivery</li>
                <li>Business document delivery</li>
                <li>Hospital and medical runs</li>
                <li>Urgent local and regional jobs</li>
                <li>Scheduled courier support for businesses</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Reliable delivery support
              </h2>

              <p className="text-muted-foreground mb-4">
                Our courier service is designed for businesses and individuals
                who need dependable collection and delivery support without
                unnecessary delay.
              </p>

              <p className="text-muted-foreground mb-6">
                Whether it is an urgent parcel, important documents or a
                scheduled delivery requirement, Cloud Cars provides a practical
                and professional courier solution.
              </p>

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/corporate-transport-nottingham">
                  <a>View Corporate Services</a>
                </Link>
              </Button>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Courier Pricing
            </h2>

            <p className="text-muted-foreground mb-6 max-w-3xl">
              Courier pricing is based on a base fare, mileage and journey time,
              with competitive rates for urgent and scheduled deliveries. Final
              pricing may vary depending on distance, urgency, waiting time and
              collection requirements.
            </p>

            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="p-4 text-left font-semibold">
                      Pricing Element
                    </th>
                    <th className="p-4 text-left font-semibold">Rate</th>
                  </tr>
                </thead>

                <tbody>
                  {courierPricing.map((item) => (
                    <tr
                      key={item.element}
                      className="border-b last:border-b-0"
                    >
                      <td className="p-4 font-medium text-foreground">
                        {item.element}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {item.rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Rates shown are guide prices only and may be subject to change.
              Please confirm your quote at the time of booking.
            </p>
          </section>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Related Cloud Cars services
              </h2>

              <div className="space-y-4">
                <Link href="/corporate-transport-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Corporate Transport</h3>
                    <p className="text-sm text-muted-foreground">
                      Transport solutions for businesses, staff travel and
                      account work.
                    </p>
                  </a>
                </Link>

                <Link href="/taxi-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Taxi Nottingham</h3>
                    <p className="text-sm text-muted-foreground">
                      Reliable everyday transport across Nottingham and nearby
                      areas.
                    </p>
                  </a>
                </Link>

                <Link href="/executive-car-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Executive Car Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium professional travel for business and important
                      journeys.
                    </p>
                  </a>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Courier support you can rely on
              </h2>

              <p className="text-muted-foreground mb-4">
                Contact Cloud Cars for dependable courier services in Nottingham
                for urgent and scheduled delivery requirements.
              </p>

              <p className="text-muted-foreground">
                We support a range of courier needs including local business
                work, document delivery, medical runs and time-sensitive
                transport requirements.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-8 lg:p-10 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Book a courier in Nottingham
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book with Cloud Cars for reliable same-day courier support,
              scheduled delivery work and practical business transport
              solutions.
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