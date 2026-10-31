import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";
import FeatureCard from "@/components/FeatureCard";
import {
  CalendarCheck,
  DoorOpen,
  HeartHandshake,
  Hospital,
  Phone,
  PoundSterling,
} from "lucide-react";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

const faqs = [
  {
    question: "Can you take me to the Queen's Medical Centre from anywhere in Nottingham?",
    answer:
      "Yes. We run journeys to the QMC from across Nottingham, including Beeston, West Bridgford and Wollaton. Book in advance with your appointment time and we will agree a pickup that gets you there without rushing.",
  },
  {
    question: "Can you collect me after my appointment?",
    answer:
      "Yes. You can book your outward and return journeys together. If you are not sure how long you will be, book your return for later or call us on 0115 8 244 244 when you are ready.",
  },
  {
    question: "Which entrance will the driver take me to?",
    answer:
      "The QMC has several entrances, so tell us where your appointment is when you book. Your appointment letter will usually say which entrance or clinic to go to. Your driver will drop you as close as the hospital's drop-off arrangements allow.",
  },
  {
    question: "Will the driver help me in and out of the car?",
    answer:
      "Yes. Our drivers will help you in and out of the car and see you to the door. If you need extra help, tell us when you book so the driver knows what to expect.",
  },
  {
    question: "Can you take passengers who use a wheelchair?",
    answer:
      "We can take passengers who use a collapsible wheelchair. You transfer to a car seat and we carry the folded chair in the boot. We do not currently have wheelchair-accessible vehicles with a ramp or lift, so we cannot carry someone who needs to stay in their wheelchair. Tell us when you book so we can send a car with room for your chair.",
  },
  {
    question: "Do you also go to Nottingham City Hospital?",
    answer:
      "Yes. We run journeys to Nottingham's hospitals, including the City Hospital, as well as surgeries and clinics. Tell us where you are going when you book.",
  },
  {
    question: "Is this an ambulance or a medical transport service?",
    answer:
      "No. Cloud Cars provides pre-booked private taxi journeys. We are not an ambulance or emergency service and we do not provide medical care. In an emergency, call 999.",
  },
];

const features = [
  {
    icon: CalendarCheck,
    title: "Booked around your appointment",
    text: "Tell us the time you need to be there and we agree a pickup that leaves a sensible margin.",
  },
  {
    icon: DoorOpen,
    title: "Right entrance, first time",
    text: "The QMC is a large site with several entrances. Tell us where you are going and your driver will take you to the right one.",
  },
  {
    icon: HeartHandshake,
    title: "Help in and out of the car",
    text: "Our drivers will help you in and out of the car and see you to the door. All our drivers are DBS-checked.",
  },
  {
    icon: PoundSterling,
    title: "Fixed price, there and back",
    text: "Your fare is agreed when you book, and you can book your outward and return journeys together.",
  },
];

const steps = [
  {
    title: "1. Tell us about the journey",
    text: "Give us your pickup address, the appointment time, and which entrance or clinic you are going to.",
  },
  {
    title: "2. We confirm the price",
    text: "You see the fare before you book. Book online, or call us if you would rather talk it through.",
  },
  {
    title: "3. We take you there and back",
    text: "Your driver arrives at the agreed time and takes you to the hospital. Book your return together, or call us when you are ready.",
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

export default function QueensMedicalCentreTaxi() {
  return (
    <PageLayout>
      <PageMeta path="/taxi-to-queens-medical-centre" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <ServiceHero
        eyebrow="Queen's Medical Centre"
        title="Taxi to the Queen's Medical Centre"
        highlight="Queen's Medical Centre"
        icon={Hospital}
        tagline="Arrive on time, without the parking stress."
        description="Pre-booked taxis to the Queen's Medical Centre for appointments, visits and shifts, from anywhere in Nottingham. DBS-checked drivers, a fixed price and help to the door."
        ctaLabel="Book a Journey"
        reassurances={[
          "Fixed price agreed at booking",
          "DBS-checked drivers",
          "Help in and out of the car",
          "Available 24/7",
        ]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <section className="mb-14 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
                A calmer way to get to the QMC
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  A hospital visit is stressful enough without worrying about
                  parking or whether you will arrive on time. Book a Cloud Cars
                  taxi in advance and you know your pickup time and your price
                  before you set off.
                </p>
                <p>
                  We take patients, relatives and visitors, and hospital staff
                  on early and late shifts, because we operate 24 hours a day.
                </p>
                <p>
                  Going to another kind of appointment? See our page on{" "}
                  <Link href="/healthcare-transport-nottingham">
                    <a className="text-primary hover:underline">
                      hospital and appointment taxis
                    </a>
                  </Link>
                  .
                </p>
              </div>
            </div>
            <img
              src="/queens-medical-centre.webp"
              alt="The main entrance of the Queen's Medical Centre, Nottingham"
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="w-full rounded-2xl border border-border object-cover shadow-sm"
            />
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
                Tell us when you book
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>Your pickup address and a contact number</li>
                <li>The time of your appointment</li>
                <li>
                  Which entrance or clinic you are going to. The QMC has several
                  entrances.
                </li>
                <li>How many people are travelling</li>
                <li>
                  Whether you use a collapsible wheelchair or other mobility
                  aid, so we can send a car with room for it
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Journeys from nearby areas
              </h2>
              <p className="mb-4 text-muted-foreground">
                We run to the QMC from across Nottingham. See the pages for the
                areas we cover:
              </p>
              <div className="space-y-3">
                <Link href="/taxi-beeston">
                  <a className="block text-primary hover:underline">
                    Taxi Beeston
                  </a>
                </Link>
                <Link href="/taxi-wollaton">
                  <a className="block text-primary hover:underline">
                    Taxi Wollaton
                  </a>
                </Link>
                <Link href="/taxi-west-bridgford">
                  <a className="block text-primary hover:underline">
                    Taxi West Bridgford
                  </a>
                </Link>
                <Link href="/corporate-transport-nottingham">
                  <a className="block text-primary hover:underline">
                    Business accounts for staff and visitor journeys
                  </a>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-bold lg:text-3xl">
              Questions about taxis to the QMC
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
              Book your journey to the QMC
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Book online or call us. If you are not sure what you need, talk it
              through with the team first.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book a Journey
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
