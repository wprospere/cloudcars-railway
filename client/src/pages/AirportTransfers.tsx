import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock,
  Luggage,
  PlaneLanding,
  PlaneTakeoff,
  Phone,
  PoundSterling,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

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

const reassurances = [
  "Fixed price agreed at booking",
  "30 minutes' waiting included",
  "We meet you in arrivals",
  "Available 24/7",
];

const steps = [
  {
    icon: CalendarCheck,
    title: "1. Book your journey",
    text: "Tell us where you're setting off from, which airport and your flight number. Your fare is fixed at booking, so you know the price before you travel.",
  },
  {
    icon: PlaneTakeoff,
    title: "2. We keep an eye on your flight",
    text: "Give us your flight number and we track it, so a delay or an early landing never catches us out.",
  },
  {
    icon: PlaneLanding,
    title: "3. We meet you at the other end",
    text: "We meet you in arrivals, help with your bags and wait if your flight is late. Thirty minutes' waiting is included on every airport pickup.",
  },
];

const features = [
  {
    icon: Clock,
    title: "Pre-Booked Reliability",
    text: "Plan your airport transfer in advance with dependable collection times and professional service from your door to the terminal.",
  },
  {
    icon: PoundSterling,
    title: "Fixed Quoted Pricing",
    text: "Clear, competitive quoted pricing for popular airport taxi routes from Nottingham and surrounding areas.",
  },
  {
    icon: Car,
    title: "Vehicle Options",
    text: "Choose from standard, executive and larger vehicle options for solo travellers, families, business clients and groups.",
  },
];

const idealFor = [
  { icon: Briefcase, text: "Business and corporate airport transfers" },
  { icon: Luggage, text: "Family holiday travel with luggage" },
  { icon: PlaneTakeoff, text: "Early morning and late-night departures" },
  { icon: PlaneLanding, text: "UK airport pickups and drop-offs" },
  { icon: Users, text: "Group airport journeys with larger vehicles available" },
];

const whyChoose = [
  "Pre-booked airport journeys from Nottingham",
  "Your fare is fixed at booking, so you know the price before you travel",
  "We meet you in arrivals, help with your bags and wait if your flight is late. Thirty minutes' waiting is included on every airport pickup",
  "Airport fees are built into your price. If your pickup runs beyond the 30 minutes included, extra waiting and parking are added at the rates shown when you book",
  "Professional drivers and reliable collection times",
  "Standard, executive and larger vehicle options",
  "Competitive pricing for major UK airport routes",
  "Suitable for individuals, families and business travellers",
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

export default function AirportTransfers() {
  return (
    <PageLayout>
      <Helmet>
        <title>
          Airport Transfers Nottingham | Nottingham Airport Taxi | Cloud Cars
        </title>
        <meta
          name="description"
          content="Book reliable airport transfers from Nottingham with Cloud Cars. Fixed quotes to East Midlands, Birmingham, Manchester and Heathrow. 24/7 pre-booked service."
        />
        <link
          rel="canonical"
          href="https://cloudcarsltd.com/airport-transfers-nottingham"
        />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src="/airport-plane.webp"
            alt=""
            aria-hidden="true"
            width={1920}
            height={1240}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full origin-[0%_35%] scale-[1.3] object-cover object-[50%_35%] lg:scale-[1.25]"
          />
          <div className="absolute inset-0 bg-background/80 lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-background from-30% via-background/60 via-50% to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 max-w-6xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <PlaneTakeoff className="h-4 w-4" />
              Cloud Cars Airport Travel
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Airport Transfers{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Nottingham
              </span>
            </h1>

            <p className="mt-5 text-xl font-medium text-foreground/90">
              Relax. We&apos;ll get you there, and we&apos;ll be waiting when
              you land.
            </p>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Whether it&apos;s a business trip, a family holiday or a 4am
              flight, our friendly local drivers get you to the airport
              comfortably and on time, from Nottingham to all major UK
              airports.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book an Airport Transfer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/70 bg-background/30 px-8 py-6 text-lg font-semibold text-foreground backdrop-blur-sm hover:bg-secondary/60"
              >
                <a href="tel:01158244244">
                  <Phone className="mr-2 h-5 w-5" />
                  0115 8 244 244
                </a>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/90">
              {reassurances.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Simple and stress-free
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              How your airport transfer{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                works
              </span>
            </h2>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3">
            <div
              aria-hidden="true"
              className="absolute left-[18%] right-[18%] top-12 hidden border-t-2 border-dashed border-primary/30 md:block"
            />
            {steps.map((step) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
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
        </div>
      </section>

      {/* Features + intro + prices */}
      <section className="section-light border-t border-border/50 bg-background pb-16 lg:pb-24">
        <div className="container max-w-6xl pt-16 lg:pt-24">
          <div className="mb-16 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl">
              Nottingham airport transfers to major UK airports
            </h2>

            <div className="max-w-4xl space-y-4 text-muted-foreground">
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

          <section className="mb-4">
            <h2 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl">
              Popular airport routes
            </h2>

            <p className="mb-8 max-w-3xl text-muted-foreground">
              Below are guide prices for some of our most popular airport
              transfer routes from Nottingham. Final pricing may vary depending
              on pickup location, time of travel, waiting time, parking, and
              vehicle type.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {airportRoutes.map((route) => (
                <div
                  key={route.airport}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <PlaneTakeoff className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {route.airport}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Standard from
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {route.standard}
                  </p>
                  <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Executive</dt>
                      <dd className="font-semibold text-foreground">
                        {route.executive}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Larger vehicle</dt>
                      <dd className="font-semibold text-foreground">
                        {route.xl}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Prices shown are guide prices. Your fixed price is confirmed at
              the time of booking, before you travel.
            </p>
          </section>
        </div>
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <img
          src="/airport-clouds.webp"
          alt=""
          aria-hidden="true"
          width={1600}
          height={2133}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_72%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="container relative z-10 max-w-6xl">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Your holiday starts at your{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                front door
              </span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Leave the parking, the queues and the stress to us. Sit back,
              relax and let a friendly local driver take you to the airport.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="mb-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-foreground">
                Ideal for all types of airport travel
              </h2>

              <ul className="space-y-4">
                {idealFor.map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-foreground">
                Why choose Cloud Cars?
              </h2>

              <ul className="space-y-3">
                {whyChoose.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
              Airports we regularly cover
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-foreground">
                  East Midlands Airport transfers
                </h3>
                <p className="text-muted-foreground">
                  East Midlands Airport is one of our most popular airport taxi
                  routes from Nottingham. If you need a taxi from Nottingham to
                  East Midlands Airport, Cloud Cars provides reliable pre-booked
                  journeys with professional drivers and comfortable vehicles.
                </p>

                <div className="mt-4">
                  <Link href="/nottingham-to-east-midlands-airport">
                    <a className="font-medium text-primary hover:underline">
                      View Nottingham to East Midlands Airport taxi page
                    </a>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-foreground">
                  Birmingham Airport transfers
                </h3>
                <p className="text-muted-foreground">
                  We provide reliable Nottingham to Birmingham Airport taxi
                  journeys for business travel, holidays and early departures.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-foreground">
                  Manchester Airport transfers
                </h3>
                <p className="text-muted-foreground">
                  For longer airport journeys, Cloud Cars offers comfortable
                  travel options with standard, executive and larger vehicle
                  choices.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-foreground">
                  Heathrow Airport transfers
                </h3>
                <p className="text-muted-foreground">
                  If you need a taxi from Nottingham to Heathrow, we offer
                  pre-booked long-distance airport transfers designed for a
                  dependable start to your journey.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
              Related Cloud Cars services
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/nottingham-to-east-midlands-airport">
                <a className="block rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md">
                  <h3 className="mb-1 font-semibold text-foreground">
                    Taxi to East Midlands Airport
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Book a direct taxi from Nottingham to East Midlands Airport
                    with fixed quoted pricing and dependable pickup times.
                  </p>
                </a>
              </Link>

              <Link href="/executive-car-nottingham">
                <a className="block rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md">
                  <h3 className="mb-1 font-semibold text-foreground">
                    Executive Car Service
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Premium airport travel for business clients and special
                    journeys.
                  </p>
                </a>
              </Link>

              <Link href="/7-seater-taxi-nottingham">
                <a className="block rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md">
                  <h3 className="mb-1 font-semibold text-foreground">
                    7 Seater Taxi
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Great for families, groups and extra luggage on airport
                    runs.
                  </p>
                </a>
              </Link>

              <Link href="/corporate-transport-nottingham">
                <a className="block rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md">
                  <h3 className="mb-1 font-semibold text-foreground">
                    Corporate Transport
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Reliable transport solutions for companies, staff and
                    business travel.
                  </p>
                </a>
              </Link>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
              Frequently asked questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground">
                    {faq.question}
                    <span className="ml-4 text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center lg:p-12">
            <h2 className="mb-3 text-2xl font-bold text-foreground lg:text-3xl">
              Book your Nottingham airport transfer
            </h2>

            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Book your airport transfer with Cloud Cars for dependable service,
              professional drivers and competitive quoted pricing from
              Nottingham and surrounding areas.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Button>

              <Button asChild size="lg" variant="outline">
                <a href="tel:01158244244">
                  <Phone className="mr-2 h-4 w-4" />
                  Call 0115 8 244 244
                </a>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
