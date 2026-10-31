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
  HeartHandshake,
  Phone,
  PoundSterling,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

const faqs = [
  {
    question: "Can I book a taxi for a hospital or clinic appointment?",
    answer:
      "Yes. Book in advance with the time of your appointment and we will agree a pickup time that gets you there without rushing. We run journeys to hospitals including the Queen's Medical Centre, as well as surgeries and clinics across Nottingham.",
  },
  {
    question: "Will the driver help me in and out of the car?",
    answer:
      "Yes. Our drivers will see you to the door, help you in and out of the car and make sure you get where you are going safely. If you need extra help, tell us when you book so the driver knows what to expect.",
  },
  {
    question: "Can a relative or carer book the journey for me?",
    answer:
      "Yes. Someone else can make the booking for you. Give us the passenger's name, the pickup and destination addresses, the time, and a contact number for the day.",
  },
  {
    question: "Can you take passengers who use a wheelchair?",
    answer:
      "We can take passengers who use a collapsible wheelchair. You transfer to a car seat and we carry the folded chair in the boot. We do not currently have wheelchair-accessible vehicles with a ramp or lift, so we cannot carry someone who needs to stay in their wheelchair. Tell us when you book so we can send a car with room for your chair.",
  },
  {
    question: "Can a surgery, clinic or care provider open an account?",
    answer:
      "Yes. An organisation can open a business account for staff, visitor and client journeys, with one clear invoice for everything. Send an enquiry or call us and we will set it up with you.",
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
    icon: HeartHandshake,
    title: "Help from door to door",
    text: "Our drivers will see you to the door and help you in and out of the car, so you get where you are going safely.",
  },
  {
    icon: ShieldCheck,
    title: "DBS-checked drivers",
    text: "Every driver is DBS-checked, licensed by Nottingham City Council or Rushcliffe Borough Council, and fully insured.",
  },
  {
    icon: PoundSterling,
    title: "Price agreed before you travel",
    text: "Your fare is fixed when you book, so there are no surprises at the end of the journey.",
  },
  {
    icon: Clock,
    title: "Early starts and late returns",
    text: "We operate 24 hours a day, so early appointments and late journeys home can be booked in advance.",
  },
  {
    icon: Stethoscope,
    title: "Hospitals, surgeries and clinics",
    text: "Journeys to the Queen's Medical Centre and other hospitals, surgeries and clinics across Nottingham.",
  },
];

const steps = [
  {
    title: "1. Tell us about the journey",
    text: "Give us the pickup address, the destination, the appointment time, and anything we should know about the help you need.",
  },
  {
    title: "2. We confirm the price",
    text: "You see the fare before you book. Book online, or call us if you would rather talk it through.",
  },
  {
    title: "3. Your driver helps you there",
    text: "Your driver arrives at the agreed time, helps you into the car and takes you to the door.",
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

export default function HealthcareTransport() {
  return (
    <PageLayout>
      <PageMeta path="/healthcare-transport-nottingham" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <ServiceHero
        eyebrow="Appointments and Care Journeys"
        title="Hospital and Appointment Taxis in Nottingham"
        highlight="Appointment Taxis in Nottingham"
        icon={Stethoscope}
        tagline="Get there calmly, and get home safely."
        description="Pre-booked taxis to hospital, clinic and surgery appointments, with DBS-checked drivers who will help you in and out of the car and see you to the door."
        ctaLabel="Book a Journey"
        reassurances={[
          "DBS-checked drivers",
          "Help to the door",
          "Fixed price agreed at booking",
          "Available 24/7",
        ]}
      />

      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <section className="mb-14">
            <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
              A journey you can plan around
            </h2>
            <div className="max-w-4xl space-y-4 text-muted-foreground">
              <p>
                A trip to the hospital, clinic or surgery is rarely an ordinary
                journey. You want to arrive on time, you want to know the price,
                and you may want a driver who will give you a hand.
              </p>
              <p>
                Cloud Cars takes pre-booked journeys for patients, relatives and
                carers across Nottingham. Book ahead, tell us the time of your
                appointment, and we will take care of the rest.
              </p>
              <p>
                Going to the Queen's Medical Centre? See our page on{" "}
                <Link href="/taxi-to-queens-medical-centre">
                  <a className="text-primary hover:underline">
                    taxis to the QMC
                  </a>
                </Link>
                .
              </p>
              <p className="font-medium text-foreground">
                We hold a contract with Nottinghamshire Healthcare NHS
                Foundation Trust.
              </p>
            </div>
          </section>

          <div className="mb-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <li>The time of your appointment, and where it is</li>
                <li>Your pickup address and a contact number</li>
                <li>How many people are travelling</li>
                <li>Any help you need getting in and out of the car</li>
                <li>
                  Whether you use a collapsible wheelchair or other mobility
                  aid, so we can send a car with room for it
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                For surgeries, clinics and care providers
              </h2>
              <p className="mb-4 text-muted-foreground">
                An organisation can open a Cloud Cars business account for staff,
                visitor and client journeys. Everything appears on one clear
                invoice, and you have one number to call.
              </p>
              <div className="space-y-3">
                <a
                  href="/#corporate-enquiry"
                  className="block text-primary hover:underline"
                >
                  Open a business account
                </a>
                <Link href="/corporate-transport-nottingham">
                  <a className="block text-primary hover:underline">
                    Corporate transport and business accounts
                  </a>
                </Link>
                <Link href="/courier-services-nottingham">
                  <a className="block text-primary hover:underline">
                    Courier services for medical items
                  </a>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-14 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-bold lg:text-3xl">
              Appointment transport questions
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
              Book your appointment journey
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
              <Button asChild size="lg" variant="outline">
                <a href="/#corporate-enquiry">Open a Business Account</a>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
