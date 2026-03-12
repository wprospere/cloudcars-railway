import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";

const faqs = [
  {
    question: "Do you provide corporate transport in Nottingham?",
    answer:
      "Yes. Cloud Cars provides corporate transport in Nottingham for staff travel, airport transfers, hotel transport, account bookings, scheduled shuttle services and other business transport requirements.",
  },
  {
    question: "Can businesses open an account with Cloud Cars?",
    answer:
      "Yes. We support account-based business transport for companies that need regular bookings, invoicing and dependable transport support.",
  },
  {
    question: "Do you offer airport transfers for business clients?",
    answer:
      "Yes. We provide corporate airport transfers from Nottingham for staff, directors, clients and guests travelling to major UK airports.",
  },
  {
    question: "Is corporate transport suitable for hotels, staff teams and apprentices?",
    answer:
      "Yes. Our corporate transport service can support hotel guest transport, staff shuttle journeys, apprentice transport, shift travel and other scheduled business requirements.",
  },
];

export default function CorporateTransport() {
  return (
    <PageLayout>
      <Helmet>
        <title>
          Corporate Transport Nottingham | Business Travel Services | Cloud Cars
        </title>
        <meta
          name="description"
          content="Dependable corporate transport in Nottingham for staff travel, airport runs, hotel transport, shuttle services and business account journeys. Book professional business travel with Cloud Cars."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/corporate-transport-nottingham"
        />
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars Business Travel"
        title="Corporate Transport Nottingham"
        description="Cloud Cars provides dependable corporate transport services in Nottingham for staff travel, business accounts, airport runs, hotel transport and scheduled journeys."
        ctaLabel="Book Corporate Travel"
      />

      <section className="pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <FeatureCard
              title="Staff Transport"
              text="Reliable transport support for employees, teams, shift coverage and regular business travel."
            />
            <FeatureCard
              title="Account Support"
              text="Practical account-based transport solutions for businesses that need invoicing and regular booking support."
            />
            <FeatureCard
              title="Flexible Scheduling"
              text="Ideal for airport runs, hotel transport, scheduled shuttles and ongoing operational transport needs."
            />
          </div>

          <section className="mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Reliable corporate transport for Nottingham businesses
            </h2>

            <div className="space-y-4 text-muted-foreground max-w-4xl">
              <p>
                Cloud Cars supports businesses in Nottingham with dependable
                corporate transport for staff, guests, clients and operational
                travel requirements. Whether you need regular staff journeys,
                airport runs, hotel collections, scheduled transport support or
                account-based bookings, we provide a professional and flexible
                service designed around business needs.
              </p>

              <p>
                Our corporate transport service is suitable for companies that
                require reliable travel arrangements, clear communication and a
                transport partner that understands the importance of timing,
                presentation and consistency. From one-off bookings to ongoing
                account work, Cloud Cars helps businesses move people
                efficiently.
              </p>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Corporate services
              </h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Staff transport</li>
                <li>Airport transfers</li>
                <li>Hotel and hospitality transport</li>
                <li>Account and invoice-based bookings</li>
                <li>Scheduled shuttle services</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Why businesses choose Cloud Cars
              </h2>

              <p className="text-muted-foreground mb-4">
                We support businesses with reliable drivers, professional
                service and flexible transport solutions tailored to operational
                needs.
              </p>

              <p className="text-muted-foreground mb-6">
                Whether you need staff collections, guest transport, airport
                journeys or regular shuttle support, Cloud Cars provides a
                dependable and professional service.
              </p>

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/executive-car-nottingham">
                  <a>View Executive Travel</a>
                </Link>
              </Button>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Ideal for a wide range of business transport needs
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Staff and shift transport
                </h3>
                <p>
                  Suitable for staff collections, shift coverage, late finishes,
                  early starts and other regular employee transport needs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Airport and station travel
                </h3>
                <p>
                  We provide dependable transport for business travellers,
                  directors, clients and guests heading to airports and rail
                  stations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Hotel and hospitality transport
                </h3>
                <p>
                  Ideal for guest journeys, apprentice transport, event travel
                  and hospitality-related transport requirements.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Account-based bookings
                </h3>
                <p>
                  A practical solution for businesses that want regular
                  transport support with invoicing and an organised booking
                  process.
                </p>
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ideal for business transport needs
              </h2>

              <ul className="space-y-3 text-muted-foreground">
                <li>Corporate airport transfers</li>
                <li>Hotel guest and hospitality transport</li>
                <li>Staff and apprentice shuttle journeys</li>
                <li>Regular account bookings</li>
                <li>Flexible pre-booked transport support</li>
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
                      Premium business travel for meetings, airport journeys and
                      professional bookings.
                    </p>
                  </a>
                </Link>

                <Link href="/airport-transfers-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Airport Transfers</h3>
                    <p className="text-sm text-muted-foreground">
                      Reliable airport transport from Nottingham to major UK
                      airports.
                    </p>
                  </a>
                </Link>

                <Link href="/courier-services-nottingham">
                  <a className="block rounded-xl border p-4 hover:border-primary transition">
                    <h3 className="font-semibold mb-1">Courier Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Practical delivery support for businesses, documents and
                      urgent runs.
                    </p>
                  </a>
                </Link>
              </div>
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
              Discuss your corporate transport needs
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              To discuss a business account, regular transport support,
              scheduled staff travel or guest transport, contact Cloud Cars
              today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <a href="mailto:bookings@cloudcarsltd.com">
                  Email Us
                </a>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}