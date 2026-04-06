import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  CarFront,
  CheckCircle2,
  Clock3,
  Leaf,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import Header from "@/components/Header";
import Services from "@/components/Services";
import Corporate from "@/components/Corporate";
import Drivers from "@/components/Drivers";
import AppPromo from "@/components/AppPromo";
import About from "@/components/About";
import Sustainability from "@/components/Sustainability";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToHash from "@/components/ScrollToHash";

function QuickBookerEmbed() {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <iframe
        src="https://book.cloudcarsltd.com/qb/#/?token=DCFvUodLCOojAxpf"
        title="Cloud Cars Quick Booker"
        className="w-full h-[720px] md:h-[820px]"
        frameBorder="0"
        scrolling="yes"
      />
    </div>
  );
}

function TrustStrip() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Licensed & DBS-checked",
      text: "Professional drivers you can trust",
    },
    {
      icon: Clock3,
      title: "24/7 booking",
      text: "Book any time, day or night",
    },
    {
      icon: Leaf,
      title: "Hybrid vehicles",
      text: "A cleaner way to travel",
    },
    {
      icon: Briefcase,
      title: "Corporate ready",
      text: "Business accounts and invoicing available",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4"
              >
                <div className="mt-0.5 rounded-xl bg-[#0e02b0]/10 p-2 text-[#0e02b0]">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-600">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pt-32 md:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,2,176,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,176,52,0.18),transparent_30%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
            <Star className="h-4 w-4 text-amber-300" />
            Trusted Nottingham taxi service since 2012
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Professional Taxi & Executive Car Service in Nottingham
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Fixed prices, licensed drivers, airport transfers, executive travel,
            and corporate transport you can rely on. Book online in seconds with
            our instant QuickBooker.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#booking">
              <Button
                size="lg"
                className="w-full rounded-2xl bg-[#00b034] px-7 text-base font-semibold text-white hover:bg-[#00972d] sm:w-auto"
              >
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>

            <a href="#booking">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-2xl border-white/25 bg-white/5 px-7 text-base text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Get Instant Quote
              </Button>
            </a>

            <a href="tel:01158244244">
              <Button
                size="lg"
                variant="ghost"
                className="w-full rounded-2xl px-7 text-base text-white hover:bg-white/10 sm:w-auto"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 0115 824 4244
              </Button>
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">Airport Transfers</p>
              <p className="mt-1 text-sm text-slate-300">
                East Midlands from £40
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">Executive Travel</p>
              <p className="mt-1 text-sm text-slate-300">
                Executive vehicles from £70
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">7 Seaters</p>
              <p className="mt-1 text-sm text-slate-300">
                XL airport travel from £75
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Card className="w-full rounded-[28px] border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#00b034]/15 p-3 text-[#6ef09a]">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Book in seconds</p>
                  <p className="text-sm text-slate-300">
                    Instant quotes with our online QuickBooker
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Fast online quotes for local and airport journeys",
                  "Choose the vehicle type that suits your journey",
                  "Perfect for retail and account customers",
                  "Professional, punctual, and pre-booked transport",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#6ef09a]" />
                    <p className="text-sm text-slate-200">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
                <p className="text-sm font-semibold text-white">
                  Why customers book with Cloud Cars
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Reliable airport transfers, smart executive transport, and a
                  more professional alternative to hoping a last-minute ride
                  turns up.
                </p>
              </div>

              <div className="mt-6">
                <a href="#booking">
                  <Button
                    className="w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
                    size="lg"
                  >
                    Start Your Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  return (
    <section id="booking" className="bg-slate-50 py-16 md:py-20 scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0e02b0]/10 px-4 py-2 text-sm font-semibold text-[#0e02b0]">
            <CarFront className="h-4 w-4" />
            Instant online booking
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Get an instant quote and book your ride online
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Enter your pickup and drop-off, choose your vehicle, and confirm your
            booking in just a few steps.
          </p>
        </div>

        <QuickBookerEmbed />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-xl bg-[#0e02b0]/10 p-2 text-[#0e02b0]">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Local and long-distance travel
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Perfect for everyday journeys, airport runs, and pre-booked travel
              across Nottingham and beyond.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-xl bg-[#0e02b0]/10 p-2 text-[#0e02b0]">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Vehicle choice built in
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Select the right option for your trip, whether you need a standard
              car, executive travel, or extra passenger space.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-xl bg-[#0e02b0]/10 p-2 text-[#0e02b0]">
              <Plane className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Great for airport transfers
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Book ahead for East Midlands, Birmingham, Manchester, Heathrow,
              and more with a smoother, more reliable transfer experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Professional & trusted",
      text: "DBS-checked, carefully selected drivers with a focus on service, safety, and reliability.",
    },
    {
      icon: Plane,
      title: "Airport specialists",
      text: "Stress-free airport transfers with fixed-price confidence and dependable pre-booked collection.",
    },
    {
      icon: Briefcase,
      title: "Corporate transport",
      text: "Business accounts, invoicing, repeat journey support, and a service that reflects well on your company.",
    },
    {
      icon: Leaf,
      title: "Hybrid fleet",
      text: "A smarter, cleaner travel option that supports more efficient day-to-day journeys.",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Why choose Cloud Cars?
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            We are built for customers who want a more reliable, more professional
            alternative to taking a chance on a last-minute ride.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="rounded-3xl border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-[#0e02b0]/10 p-3 text-[#0e02b0]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PopularJourneysSection() {
  const journeys = [
    {
      title: "East Midlands Airport",
      price: "From £40",
      description: "Fast, simple airport transfers from Nottingham.",
    },
    {
      title: "Birmingham Airport",
      price: "From £110",
      description: "Ideal for families, business travel, and early departures.",
    },
    {
      title: "Manchester Airport",
      price: "From £150",
      description: "Pre-booked long-distance travel with peace of mind.",
    },
    {
      title: "Heathrow Airport",
      price: "From £260",
      description: "Reliable long-haul airport transfer service from Nottingham.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Popular airport journeys
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Clear price anchors help customers book faster and with more
              confidence.
            </p>
          </div>

          <Link href="/airport-transfers-nottingham">
            <a className="inline-flex items-center text-sm font-semibold text-[#0e02b0] hover:underline">
              View airport transfer details
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {journeys.map((journey) => (
            <Card
              key={journey.title}
              className="rounded-3xl border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-[#00b034]/10 p-3 text-[#00b034]">
                  <Plane className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {journey.title}
                </h3>
                <p className="mt-2 text-2xl font-bold text-[#0e02b0]">
                  {journey.price}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {journey.description}
                </p>

                <div className="mt-5">
                  <a
                    href="#booking"
                    className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#0e02b0]"
                  >
                    Book this journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="bg-slate-950 py-16 text-white md:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to book your next journey?
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          Whether you need an airport transfer, executive car, local journey, or
          a dependable business transport partner, Cloud Cars makes booking easy.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#booking">
            <Button
              size="lg"
              className="w-full rounded-2xl bg-[#00b034] px-7 text-base font-semibold text-white hover:bg-[#00972d] sm:w-auto"
            >
              Book Online Now
            </Button>
          </a>

          <a href="tel:01158244244">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-2xl border-white/20 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Call 0115 824 4244
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href="#booking"
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#00b034] px-4 py-3 text-sm font-semibold text-white shadow-sm"
        >
          Book Now
        </a>

        <a
          href="tel:01158244244"
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
        >
          Call Us
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>
          Cloud Cars: Taxi Nottingham | Airport Transfers & Corporate Travel
        </title>
        <meta
          name="description"
          content="Cloud Cars is Nottingham’s trusted taxi and executive car service. Book airport transfers, local journeys, executive travel, and corporate transport online 24/7."
        />
        <link rel="canonical" href="https://cloudcarsltd.com/" />

        <meta
          property="og:title"
          content="Cloud Cars: Taxi Nottingham | Airport Transfers & Corporate Travel"
        />
        <meta
          property="og:description"
          content="Professional Nottingham taxi service with airport transfers, executive cars, hybrid vehicles, and corporate transport."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloudcarsltd.com/" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: "Cloud Cars",
            url: "https://cloudcarsltd.com/",
            areaServed: "Nottingham",
            telephone: "01158244244",
            description:
              "Professional Nottingham taxi service offering airport transfers, executive travel, hybrid vehicles, and corporate transport.",
          })}
        </script>
      </Helmet>

      <ScrollToHash />
      <Header />

      <main className="bg-white">
        <HeroSection />
        <TrustStrip />
        <BookingSection />
        <WhyChooseUsSection />
        <PopularJourneysSection />

        <Services />
        <Corporate />
        <Drivers />
        <AppPromo />
        <About />
        <Sustainability />
        <Contact />

        <FinalCTASection />
      </main>

      <Footer />
      <MobileStickyCTA />
    </>
  );
}