import PageMeta from "@/components/PageMeta";
import { Link } from "wouter";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Camera,
  Car,
  FileText,
  Gift,
  KeyRound,
  Leaf,
  MapPin,
  Package,
  Phone,
  Route,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/PageLayout";
import ServiceHero from "@/components/ServiceHero";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

const steps = [
  {
    icon: Package,
    title: "Book in minutes",
    text: "Book online or call us with the collection and delivery addresses. We confirm your price before we send a driver.",
  },
  {
    icon: Car,
    title: "Collected by a licensed driver",
    text: "A local, council-licensed Cloud Cars driver collects your item and takes it straight to its destination.",
  },
  {
    icon: Camera,
    title: "Delivered, with proof",
    text: "We hand it over in person and record the delivery, so you know exactly when it arrived and who took it.",
  },
];

const features = [
  {
    icon: Route,
    title: "Direct, door to door",
    text: "Your item stays in one car with one driver from collection to delivery. No depots, no sorting, no transfers.",
  },
  {
    icon: Camera,
    title: "Proof of delivery",
    text: "Every delivery is recorded, so you have a clear answer when someone asks whether it got there.",
  },
  {
    icon: Briefcase,
    title: "Business accounts",
    text: "Book courier runs on the same account as your staff travel, with one monthly invoice.",
  },
];

const items = [
  {
    icon: FileText,
    title: "Documents and contracts",
    text: "Signed agreements, legal papers, tenders and anything that has to arrive today.",
  },
  {
    icon: Stethoscope,
    title: "Hospital and medical runs",
    text: "Samples, records and supplies between surgeries, clinics, pharmacies and hospitals.",
  },
  {
    icon: Wrench,
    title: "Parts and urgent spares",
    text: "The part that is holding up a job, collected from the supplier and delivered to site.",
  },
  {
    icon: KeyRound,
    title: "Keys and small packages",
    text: "Keys for tenants and contractors, passports, laptops and other items too important to post.",
  },
  {
    icon: Building2,
    title: "Regular office runs",
    text: "Scheduled collections between your sites, banks, post rooms and partners.",
  },
  {
    icon: Gift,
    title: "Personal deliveries",
    text: "Gifts, forgotten items and anything you need taken across town the same day.",
  },
];

const faqs = [
  {
    question: "Do you provide same-day courier services in Nottingham?",
    answer:
      "Yes. We collect and deliver the same day across Nottingham and the surrounding area, and to towns and cities further afield.",
  },
  {
    question: "How much does a courier cost?",
    answer:
      "It depends on the distance and how urgent the job is. Book online or call 0115 8 244 244 and we'll confirm the price before we send a driver.",
  },
  {
    question: "Can businesses use the courier service regularly?",
    answer:
      "Yes. Account customers can book courier runs alongside staff travel and receive one monthly invoice. Regular scheduled collections can be set up too.",
  },
  {
    question: "Is the service suitable for hospital and medical runs?",
    answer:
      "Yes. We carry time-sensitive items between hospitals, clinics, surgeries and pharmacies, collected and delivered directly by one driver.",
  },
  {
    question: "What size items can you carry?",
    answer:
      "Our courier service uses cars, so it suits documents, parcels and items that fit in a car boot or on the back seat. Ask us if you're unsure.",
  },
];

export default function CourierServices() {
  return (
    <PageLayout>
      <PageMeta path="/courier-services-nottingham" />

      <ServiceHero
        eyebrow="Cloud Cars Courier"
        title="Courier Services Nottingham"
        description="When it has to arrive today, we collect it and take it straight there. Documents, parcels, medical items and urgent parts, driven direct by a local licensed driver."
        ctaLabel="Book a Courier"
        icon={Package}
        tagline="Collected now. Delivered direct."
        highlight="Nottingham"
        image="/service-courier.webp"
        imageClassName="-scale-x-100 object-[50%_50%]"
        reassurances={["Same-day delivery", "Direct, door to door", "Proof of delivery", "Business accounts"]}
      />

      {/* How it works */}
      <section className="section-light bg-background py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Simple and quick
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              How our courier service{" "}
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
        </div>
      </section>

      {/* Why Cloud Cars + what we carry */}
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

          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              What we carry
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              The things that{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                can't wait
              </span>
            </h2>
          </div>

          <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coverage + quote */}
          <section className="mb-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Across Nottingham, and beyond
              </h2>
              <p className="mb-4 text-muted-foreground">
                We cover the whole city, from the centre to Beeston, West
                Bridgford, Wollaton and Edwalton, and run same-day deliveries
                further afield across the Midlands and beyond.
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Leaf className="h-4 w-4 shrink-0 text-primary" />
                Most deliveries travel in our hybrid cars.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Get a price in a minute
              </h2>
              <p className="mb-6 text-muted-foreground">
                Tell us where it's going and how soon. We'll give you a fixed
                price before we send a driver, and that's the price you pay.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="group bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    Book a Courier
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <a href="tel:01158244244">
                    <Phone className="mr-2 h-4 w-4" />
                    0115 8 244 244
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section className="mb-16 rounded-2xl border bg-card p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
              Frequently asked questions
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

          <section className="grid gap-4 md:grid-cols-3">
            <Link href="/corporate-transport-nottingham">
              <a className="block rounded-xl border bg-card p-5 transition hover:border-primary">
                <h3 className="mb-1 font-semibold">Corporate Transport</h3>
                <p className="text-sm text-muted-foreground">
                  Staff travel and courier work on one business account.
                </p>
              </a>
            </Link>
            <Link href="/taxi-nottingham">
              <a className="block rounded-xl border bg-card p-5 transition hover:border-primary">
                <h3 className="mb-1 font-semibold">Taxi Nottingham</h3>
                <p className="text-sm text-muted-foreground">
                  Reliable everyday travel across Nottingham.
                </p>
              </a>
            </Link>
            <Link href="/executive-car-nottingham">
              <a className="block rounded-xl border bg-card p-5 transition hover:border-primary">
                <h3 className="mb-1 font-semibold">Executive Car Service</h3>
                <p className="text-sm text-muted-foreground">
                  Premium cars for business and important journeys.
                </p>
              </a>
            </Link>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
