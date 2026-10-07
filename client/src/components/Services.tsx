import {
  Car,
  Package,
  Plane,
  Crown,
  Users,
  Briefcase,
  Check,
  CheckCircle2,
  Mail,
  Clock,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;

  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, props);
  }
}

const services = [
  {
    id: "car-service",
    icon: Car,
    title: "Local Taxi Travel",
    subtitle: "Everyday Journeys",
    slug: "/taxi-nottingham",
    description:
      "Reliable taxi travel across Nottingham for local journeys, appointments, station runs and pre-booked everyday transport.",
    price: "Fixed Prices",
    priceNote: "quoted at booking",
    features: [
      "Comfortable saloon cars",
      "Friendly local drivers",
      "Upfront pricing",
      "Available round the clock",
      "City & surrounding areas",
    ],
    popular: false,
    bookingType: "instant",
  },
  {
    id: "courier",
    icon: Package,
    title: "Courier Service",
    subtitle: "Local Deliveries",
    slug: "/courier-services-nottingham",
    description:
      "Dependable courier services in Nottingham for parcels, documents, urgent runs and same-day delivery requirements.",
    price: "Fixed Prices",
    priceNote: "quoted upfront",
    features: [
      "Same-day delivery",
      "Secure handling",
      "Proof of delivery",
      "Business accounts available",
      "Nottingham & surrounding areas",
    ],
    popular: false,
    bookingType: "instant",
  },
  {
    id: "airport",
    icon: Plane,
    title: "Airport Transfers",
    subtitle: "Stress-Free Travel",
    slug: "/airport-transfers-nottingham",
    description:
      "Pre-booked airport transfers from Nottingham to East Midlands Airport and all major UK airports, with dependable timing, flight tracking, and professional service.",
    price: "Fixed Prices",
    priceNote: "no surprises",
    features: [
      "East Midlands Airport",
      "Flight tracking included",
      "Meet & greet available",
      "Early morning pickups",
      "All UK airports covered",
    ],
    popular: true,
    bookingType: "instant",
  },
  {
    id: "executive",
    icon: Crown,
    title: "Executive Service",
    subtitle: "Travel in Style",
    slug: "/executive-car-nottingham",
    description:
      "Executive travel in Nottingham for business meetings, airport journeys, client collections and premium pre-booked transport.",
    price: "Premium Service",
    priceNote: "luxury travel",
    features: [
      "Mercedes & BMW fleet",
      "Bottled water & phone chargers",
      "Professional chauffeurs",
      "Book-ahead guarantee",
      "Business-ready travel",
    ],
    popular: false,
    bookingType: "instant",
  },
  {
    id: "corporate",
    icon: Briefcase,
    title: "Corporate Transport",
    subtitle: "Business Travel",
    slug: "/corporate-transport-nottingham",
    description:
      "Reliable business transport for staff travel, airport runs, hotel transport, account work and scheduled company journeys with dependable service and invoice-based support.",
    price: "Account Options",
    priceNote: "tailored support",
    features: [
      "Staff transport",
      "Airport runs",
      "Hotel and guest travel",
      "Invoice-based bookings",
      "Scheduled shuttle support",
    ],
    popular: false,
    bookingType: "account",
  },
];

const largerVehicles = {
  icon: Users,
  title: "Larger Vehicles",
  subtitle: "7 to 16 Seaters",
  description:
    "Need transport for a group? We offer larger vehicles from 7 to 16 seats for airport runs, events, corporate outings, family travel, school trips and more.",
  features: [
    "7, 8, 12 and 16 seater options",
    "Ideal for airport groups",
    "Corporate events and outings",
    "Wedding guest transport",
    "School and sports team trips",
  ],
  email: "bookings@cloudcarsltd.com",
  notice: "72 hours",
  slug: "/7-seater-taxi-nottingham",
};

export default function Services() {
  const scrollToCorporate = () => {
    const element = document.querySelector("#corporate");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        id="services"
        className="relative overflow-hidden bg-background pt-20 pb-24 lg:pt-28 lg:pb-32"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/nottingham-council-house.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full origin-left scale-[1.3] object-cover object-[50%_40%]"
          />
          <div className="absolute inset-0 bg-background/80 lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-background from-30% via-background/60 via-50% to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Services
            </span>

            <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Local drivers. Fixed fares.{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Every journey.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Nottingham's local private hire firm since 2012. We run a 100%
              hybrid fleet, our drivers know the city inside out, and you'll
              know your fare before you set off. Whatever the journey, from a
              quick local taxi to an airport run, an executive car, a courier
              delivery or a company account, we do it properly.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <a
                  href="https://book.cloudcarsltd.com/portal/#/booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("services_book_now_click")}
                >
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/70 bg-background/30 px-8 py-6 text-lg font-semibold text-foreground backdrop-blur-sm hover:bg-secondary/60"
              >
                <a
                  href="tel:01158244244"
                  onClick={() => track("services_call_click")}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  0115 8 244 244
                </a>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/90">
              {[
                "Serving Nottingham since 2012",
                "100% hybrid fleet",
                "Fixed fare before you travel",
                "Available 24/7",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    <section className="section-light bg-background py-16 lg:py-24">
      <div className="container">

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {services.filter((s) => s.bookingType === "instant").map((service) => (
            <div
              key={service.id}
              className={`relative bg-card rounded-2xl p-6 border card-hover ${
                service.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <service.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {service.subtitle}
              </p>

              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-5">
                <span className="text-2xl font-bold text-foreground">
                  {service.price}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {service.priceNote}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link
                    href={service.slug}
                    onClick={() =>
                      track("service_page_click", {
                        location: "services_card",
                        service_id: service.id,
                        service_title: service.title,
                        slug: service.slug,
                      })
                    }
                  >
                    Learn More
                    <span className="sr-only"> about {service.title} in Nottingham</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className={`w-full ${
                    service.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  <a
                    href="https://book.cloudcarsltd.com/portal/#/booking"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("book_now_click", {
                        location: "services_card",
                        service_id: service.id,
                        service_title: service.title,
                        popular: service.popular,
                      })
                    }
                  >
                    Book Now
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Transport — account-based, presented separately from instant-booking cards */}
        <div className="bg-card rounded-2xl p-6 lg:p-8 border border-primary/30 shadow-lg shadow-primary/5 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Corporate Transport</h3>
                <p className="text-sm text-primary font-medium">Business Travel · Invoiced Accounts</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Reliable staff transport, airport runs, hotel guest travel and scheduled journeys — with invoiced accounts and a team who answers the phone.
            </p>
            <div className="flex gap-3 shrink-0">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link
                  href="/corporate-transport-nottingham"
                  onClick={() => track("service_page_click", { location: "services_card", service_id: "corporate", service_title: "Corporate Transport", slug: "/corporate-transport-nottingham" })}
                >
                  Learn More
                  <span className="sr-only"> about Corporate Transport in Nottingham</span>
                </Link>
              </Button>
              <Button
                onClick={() => { scrollToCorporate(); track("cta_click", { location: "services_card", cta: "corporate_accounts" }); }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Open an Account
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 lg:p-10 border border-primary/30 shadow-lg shadow-primary/5">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <largerVehicles.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {largerVehicles.title}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {largerVehicles.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {largerVehicles.description}
              </p>

              <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                {largerVehicles.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link
                    href={largerVehicles.slug}
                    onClick={() =>
                      track("service_page_click", {
                        location: "larger_vehicles",
                        service_title: largerVehicles.title,
                        slug: largerVehicles.slug,
                      })
                    }
                  >
                    Learn More
                    <span className="sr-only"> about {largerVehicles.title} in Nottingham</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a
                    href={`mailto:${largerVehicles.email}?subject=Larger%20Vehicle%20Booking%20Enquiry%20-%20Cloud%20Cars`}
                    onClick={() =>
                      track("contact_click", {
                        type: "email",
                        location: "larger_vehicles",
                      })
                    }
                  >
                    Request a Quote
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 lg:p-8">
              <h4 className="text-lg font-bold text-foreground mb-4">
                How to Book Larger Vehicles
              </h4>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Email Us
                    </p>
                    <a
                      href={`mailto:${largerVehicles.email}?subject=Larger%20Vehicle%20Booking%20Enquiry%20-%20Cloud%20Cars`}
                      onClick={() =>
                        track("contact_click", {
                          type: "email",
                          location: "larger_vehicles",
                        })
                      }
                      className="text-primary hover:underline font-medium"
                    >
                      {largerVehicles.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Advance Notice Required
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Please allow at least{" "}
                      <span className="text-primary font-semibold">
                        {largerVehicles.notice}
                      </span>{" "}
                      notice for larger vehicle bookings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Include your pickup location, destination, date, time, number
                  of passengers, and any luggage requirements in your email and
                  we’ll get back to you with a quote as quickly as possible.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need regular transport for your business?
          </p>

          <Button
            onClick={() => {
              scrollToCorporate();
              track("cta_click", {
                location: "services_section",
                cta: "corporate_accounts",
              });
            }}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Learn About Corporate Accounts
          </Button>
        </div>
      </div>
    </section>
    </>
  );
}