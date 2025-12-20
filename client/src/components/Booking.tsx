import { Button } from "@/components/ui/button";
import {
  Car,
  Package,
  Plane,
  Crown,
  ArrowRight,
  Phone,
  ExternalLink,
} from "lucide-react";

const serviceTypes = [
  { value: "standard", label: "Car Service", description: "Comfortable everyday travel", icon: Car },
  { value: "courier", label: "Courier Service", description: "Local deliveries & packages", icon: Package },
  { value: "airport", label: "Airport Transfer", description: "Fixed price airport runs", icon: Plane },
  { value: "executive", label: "Executive Service", description: "Premium luxury vehicles", icon: Crown },
];

export default function Booking() {
  return (
    <section id="booking" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Book Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Ready to{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Get Moving?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Book your ride online in seconds through our booking portal, or give us a call on{" "}
              <a href="tel:01158244244" className="text-primary font-semibold hover:underline">
                0115 8 244 244
              </a>
            </p>
          </div>

          {/* Service Selection Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {serviceTypes.map((service) => (
              <a
                key={service.value}
                href="https://book.cloudcarsltd.com/portal/#/booking"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card rounded-xl p-5 border border-border hover:border-primary transition-all duration-300 card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{service.label}</h3>
                <p className="text-xs text-muted-foreground">{service.description}</p>
              </a>
            ))}
          </div>

          {/* Main CTA */}
          <div className="bg-card rounded-2xl p-8 lg:p-10 border border-primary/30 shadow-lg shadow-primary/5">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left - Online Booking */}
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Book Online
                </h3>
                <p className="text-muted-foreground mb-6">
                  Use our online booking portal to book your ride instantly. 
                  Enter your pickup and destination, choose your service, and you're all set.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group"
                >
                  <a href="https://book.cloudcarsltd.com/portal/#/booking" target="_blank" rel="noopener noreferrer">
                    Book Now
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>

              {/* Right - Phone Booking */}
              <div className="bg-secondary/50 rounded-xl p-6 lg:p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Prefer to Call?
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Our team is available 24/7 to take your booking
                </p>
                <a
                  href="tel:01158244244"
                  className="text-2xl font-bold text-primary hover:underline"
                >
                  0115 8 244 244
                </a>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">12+ years</span> serving Nottingham • 
              <span className="text-primary font-semibold ml-1">100K+</span> journeys completed • 
              <span className="text-primary font-semibold ml-1">99%</span> on-time arrivals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
