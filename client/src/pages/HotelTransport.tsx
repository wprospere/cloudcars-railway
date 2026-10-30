import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";
import {
  Building2,
  CalendarCheck,
  Clock,
  FileText,
  PlaneLanding,
  Phone,
  Users,
} from "lucide-react";

const faqs = [
  {
    question: "Can a hotel open a Cloud Cars account?",
    answer:
      "Yes. A hotel can open a business account for guest and staff transport, with one invoice for all journeys. Call us or send an enquiry and we will set it up with you.",
  },
  {
    question: "Who can book transport for guests?",
    answer:
      "A nominated person in your team, such as reception or the concierge, can arrange travel for guests, visitors and staff. Your account keeps all the bookings in one place.",
  },
  {
    question: "Do you do airport transfers for hotel guests?",
    answer:
      "Yes. We provide pre-booked transfers to East Midlands, Birmingham, Manchester and Heathrow airports. Your fare is fixed at booking, we track the flight for arrivals and we meet guests in arrivals, with 30 minutes' waiting included on airport pickups.",
  },
  {
    question: "How does billing work?",
    answer:
      "All account journeys appear on one clear invoice, weekly, fortnightly or monthly, with a breakdown your finance team can use.",
  },
  {
    question: "Can you take larger groups or arrange executive cars?",
    answer:
      "Yes, subject to availability. Larger vehicles need at least 72 hours' notice. Tell us the number of passengers, the date and where they are going, and we will confirm what we can provide.",
  },
];

const features = [
  {
    icon: PlaneLanding,
    title: "Guest airport transfers",
    text: "Pre-booked transfers to East Midlands, Birmingham, Manchester and Heathrow, with the fare fixed at booking, flight tracking and a meeting point in arrivals.",
  },
  {
    icon: Users,
    title: "Book on behalf of guests",
    text: "Reception or the concierge can arrange travel for guests, visitors and staff from one account.",
  },
  {
    icon: FileText,
    title: "One account, one invoice",
    text: "All journeys on one clear invoice, with a breakdown for your finance team.",
  },
  {
    icon: Clock,
    title: "Early starts and late nights",
    text: "We operate 24 hours a day, so early departures and late arrivals can be booked in advance.",
  },
];

const steps = [
  {
    icon: Building2,
    title: "1. Open an account",
    text: "Tell us about your hotel and the journeys your guests usually need. We set up your account and agree how you are invoiced.",
  },
  {
    icon: CalendarCheck,
    title: "2. Book for your guests",
    text: "Your team books online or by phone, with the guest's details, flight number and pickup time.",
  },
  {
    icon: Phone,
    title: "3. One number for changes",
    text: "If a flight is delayed or plans change, you have one number to call and a team that knows your account.",
  },
];

const routes = [
  { label: "Nottingham to East Midlands Airport", href: "/nottingham-to-east-midlands-airport" },
  { label: "Nottingham to Birmingham Airport", href: "/nottingham-to-birmingham-airport" },
  { label: "Nottingham to Manchester Airport", href: "/nottingham-to-manchester-airport" },
  { label: "Nottingham to Heathrow Airport", href: "/nottingham-to-heathrow-airport" },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function HotelTransport() {
  return (
    <PageLayout>
      <PageMeta path="/hotel-transport-nottingham" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <ServiceHero
        eyebrow="Cloud Cars for Hotels"
        title="Guest Transport for Nottingham Hotels"
        highlight="Nottingham Hotels"
        icon={Building2}
        tagline="Your guests' journeys, handled."
        description="Reliable airport transfers and local transport for hotel guests, booked through one account with one invoice and a team you can call."
        ctaLabel="Open a Hotel Account"
        ctaHref="/#corporate"
        // TODO: add a hotel photo here, e.g. image="/hotel-guest-transport.webp"
        reassurances={[
          "One account, one invoice",
          "Fixed price agreed at booking",
          "Flight tracking for airport guests",
          "Available 24/7",
        ]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <section className="mb-14">
            <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
              Transport your guests can rely on
            </h2>
            <div className="max-w-4xl space-y-4 text-muted-foreground">
              <p>
                For a guest, the stay starts and ends with the journey. A
                driver who is on time, a fare that is agreed in advance and
                someone to call when a flight is delayed all reflect on your
                hotel.
              </p>
              <p>
                Cloud Cars works with Nottingham hotels to arrange guest
                airport transfers and local journeys through a managed account.
                Your team books, we look after the journey, and you receive one
                invoice.
              </p>
            </div>
          </section>

          <div className="mb-14 grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                text={f.text}
              />
            ))}
          </div>

          <section className="mb-14 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">How it works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.title}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Popular guest journeys
              </h2>
              <p className="mb-4 text-muted-foreground">
                Airport transfers are the most requested journeys for hotel
                guests. See the details and guide prices for each route:
              </p>
              <div className="space-y-3">
                {routes.map((r) => (
                  <Link key={r.href} href={r.href}>
                    <a className="block text-primary hover:underline">
                      {r.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Groups, events and executive guests
              </h2>
              <p className="mb-4 text-muted-foreground">
                We can arrange larger vehicles for groups and wedding or event
                parties, and executive vehicles for VIP guests, subject to
                availability. Larger vehicles need at least 72 hours&apos;
                notice.
              </p>
              <div className="space-y-3">
                <Link href="/7-seater-taxi-nottingham">
                  <a className="block text-primary hover:underline">
                    Larger vehicles
                  </a>
                </Link>
                <Link href="/executive-car-nottingham">
                  <a className="block text-primary hover:underline">
                    Executive car service
                  </a>
                </Link>
                <Link href="/corporate-transport-nottingham">
                  <a className="block text-primary hover:underline">
                    Corporate transport and business accounts
                  </a>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-bold lg:text-3xl">
              Hotel transport questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-8 text-center lg:p-10">
            <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
              Talk to us about your hotel
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Tell us about your hotel and the journeys your guests need, and we
              will set up an account that works for your team.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href="/#corporate">Open a Hotel Account</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:01158244244">
                  <Phone className="mr-2 h-5 w-5" />
                  0115 8 244 244
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="mailto:bookings@cloudcarsltd.com">Email Us</a>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
