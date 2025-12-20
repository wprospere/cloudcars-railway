import { Car, Package, Plane, Crown, Users, Check, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "car-service",
    icon: Car,
    title: "Car Service",
    subtitle: "Daily Rides",
    description:
      "Your go-to option for getting around Nottingham. Clean cars, friendly drivers, and fares that won't break the bank.",
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
    description:
      "Need something delivered across Nottingham? Our courier service handles packages, documents, and urgent deliveries with care.",
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
    description:
      "Getting to East Midlands Airport or beyond? We'll get you there on time, every time. Flight tracking included.",
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
    description:
      "When you want something special. Premium vehicles for business meetings, nights out, or when you just fancy treating yourself.",
    price: "Premium Service",
    priceNote: "luxury travel",
    features: [
      "Mercedes & BMW fleet",
      "Bottled water & phone chargers",
      "Professional chauffeurs",
      "Corporate accounts welcome",
      "Book ahead guarantee",
    ],
    popular: false,
    bookingType: "instant",
  },
];

const largerVehicles = {
  icon: Users,
  title: "Larger Vehicles",
  subtitle: "7 to 16 Seaters",
  description:
    "Need transport for a group? We have minibuses from 7 to 16 seats for airport runs, events, corporate outings, and more.",
  features: [
    "7, 8, 12, and 16 seater options",
    "Perfect for airport groups",
    "Corporate events & outings",
    "Wedding guest transport",
    "School & sports team trips",
  ],
  email: "bookings@cloudcarsltd.com",
  notice: "72 hours",
};

export default function Services() {
  const scrollToBooking = () => {
    const element = document.querySelector("#booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCorporate = () => {
    const element = document.querySelector("#corporate");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Whatever You Need,{" "}
            <span className="text-gradient-green font-['Playfair_Display',serif] italic">
              We've Got You
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From quick trips around town to airport transfers and courier deliveries, 
            Cloud Cars has the right service for every journey.
          </p>
        </div>

        {/* Service Cards - Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative bg-card rounded-2xl p-6 border card-hover ${
                service.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <service.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-foreground mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {service.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {service.description}
              </p>

              {/* Price */}
              <div className="mb-5">
                <span className="text-2xl font-bold text-foreground">
                  {service.price}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {service.priceNote}
                </span>
              </div>

              {/* Features */}
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

              {/* CTA */}
              <Button
                asChild
                className={`w-full ${
                  service.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                <a href="https://book.cloudcarsltd.com/portal/#/booking" target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Larger Vehicles Section */}
        <div className="bg-card rounded-2xl p-8 lg:p-10 border border-primary/30 shadow-lg shadow-primary/5">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
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

              {/* Features */}
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
            </div>

            {/* Right - Booking Info */}
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
                      href={`mailto:${largerVehicles.email}`}
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
                      Please give us at least <span className="text-primary font-semibold">{largerVehicles.notice}</span> notice for larger vehicle bookings
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Include your pickup location, destination, date, time, and number of passengers in your email. We'll get back to you with a quote within a few hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Accounts CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need regular transport for your business?
          </p>
          <Button
            onClick={scrollToCorporate}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Learn About Corporate Accounts
          </Button>
        </div>
      </div>
    </section>
  );
}
