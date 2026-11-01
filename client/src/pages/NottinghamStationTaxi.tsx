import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";
import {
  CalendarCheck,
  Clock,
  Luggage,
  Phone,
  PoundSterling,
  Train,
} from "lucide-react";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

const faqs = [
  {
    question: "Can I book a taxi to or from Nottingham station?",
    answer:
      "Yes. We take pre-booked journeys to and from Nottingham railway station. Book in advance with your train time and we will agree a pickup that suits it.",
  },
  {
    question: "How early should I leave for my train?",
    answer:
      "We recommend booking your pickup so you arrive at the station at least 45 minutes to 1 hour before your scheduled departure. Our Train & Airport Transfer Policy explains this in full.",
  },
  {
    question: "Can you collect me when my train arrives?",
    answer:
      "Yes. Pre-book your journey and tell us your arrival time and where you are going. If your plans change, call us on 0115 8 244 244.",
  },
  {
    question: "What happens if my train is delayed or cancelled?",
    answer:
      "Call us on 0115 8 244 244 as soon as you know, and we will tell you what we can do. Please give us your train time when you book so we can plan around it.",
  },
  {
    question: "Do you cover other stations?",
    answer:
      "Yes. We run pre-booked journeys to and from stations across Nottingham and the East Midlands, including Beeston station. Tell us which station when you book.",
  },
  {
    question: "Can I book a taxi from the station to the airport?",
    answer:
      "Yes. We run pre-booked transfers to East Midlands, Birmingham, Manchester and Heathrow airports, with the fare fixed at booking.",
  },
];

const features = [
  {
    icon: CalendarCheck,
    title: "Booked around your train",
    text: "Tell us your train time and we agree a pickup that leaves a sensible margin for the platform.",
  },
  {
    icon: PoundSterling,
    title: "Fixed price at booking",
    text: "You see your fare before you book, so there are no surprises when you get out at the station.",
  },
  {
    icon: Clock,
    title: "Early trains and late arrivals",
    text: "We operate 24 hours a day, so first trains and late arrivals can be booked in advance.",
  },
  {
    icon: Luggage,
    title: "Luggage and groups",
    text: "Travelling with cases or as a group? Tell us when you book and we will make sure the car suits.",
  },
];

const steps = [
  {
    title: "1. Tell us your train time",
    text: "Give us the pickup address, the station, and the time of your train.",
  },
  {
    title: "2. We confirm the price",
    text: "You see the fare before you book. Book online, or call us to talk it through.",
  },
  {
    title: "3. Arrive in good time",
    text: "Your driver arrives at the agreed time and gets you to the station with time to spare.",
  },
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

export default function NottinghamStationTaxi() {
  return (
    <PageLayout>
      <PageMeta path="/nottingham-station-taxi" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <ServiceHero
        eyebrow="Nottingham Station"
        title="Taxi to Nottingham Station"
        highlight="Nottingham Station"
        icon={Train}
        tagline="Make your train, without the rush."
        description="Pre-booked taxis to and from Nottingham railway station, with a fixed price agreed at booking and drivers who know the city. Available 24/7."
        ctaLabel="Book a Station Taxi"
        reassurances={[
          "Fixed price agreed at booking",
          "DBS-checked, licensed drivers",
          "Early trains and late arrivals",
          "Available 24/7",
        ]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <section className="mb-14">
            <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
              A taxi that fits your train
            </h2>
            <div className="max-w-4xl space-y-4 text-muted-foreground">
              <p>
                A missed train can throw off a whole day. Booking a Cloud Cars
                taxi in advance means your pickup time is agreed against your
                train, your price is fixed, and a professional driver who knows
                Nottingham gets you there.
              </p>
              <p>
                We take pre-booked journeys to and from Nottingham station for
                commuters, business travellers, families and visitors. Give us
                your train time when you book and we will work back from there.
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
                Allow time before your train
              </h2>
              <p className="mb-4 text-muted-foreground">
                We recommend arriving at the station at least 45 minutes to 1
                hour before your scheduled departure. Traffic and roadworks can
                affect any journey, so a sensible buffer gives you room to
                spare.
              </p>
              <Link href="/train-airport-transfer-policy">
                <a className="text-primary hover:underline">
                  Read our Train &amp; Airport Transfer Policy
                </a>
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Onward journeys and other stations
              </h2>
              <div className="space-y-3">
                <Link href="/taxi-beeston">
                  <a className="block text-primary hover:underline">
                    Taxi Beeston, including Beeston station
                  </a>
                </Link>
                <Link href="/nottingham-to-east-midlands-airport">
                  <a className="block text-primary hover:underline">
                    Nottingham to East Midlands Airport
                  </a>
                </Link>
                <Link href="/airport-transfers-nottingham">
                  <a className="block text-primary hover:underline">
                    Airport transfers from Nottingham
                  </a>
                </Link>
                <Link href="/corporate-transport-nottingham">
                  <a className="block text-primary hover:underline">
                    Business accounts for staff travel
                  </a>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-bold lg:text-3xl">
              Nottingham station taxi questions
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
              Book your station taxi
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Book online or call us. Have your train time to hand.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book a Station Taxi
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:01158244244">
                  <Phone className="mr-2 h-5 w-5" />
                  0115 8 244 244
                </a>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
