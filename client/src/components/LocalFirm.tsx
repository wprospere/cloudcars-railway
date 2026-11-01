// "Book local" section. Only states facts Cloud Cars has confirmed: a
// Nottingham company since 2012 with its office in Nottingham, plus claims the
// rest of the site already makes (fixed price at booking, local knowledge).
// Do not add fleet or driver numbers, or comparisons with named companies,
// without a source.

import { MapPin, Phone, PoundSterling, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";

const BOOKING_URL = "https://book.cloudcarsltd.com/portal/#/booking";

const points = [
  {
    icon: MapPin,
    title: "Based in Nottingham",
    text: "Our office is in Nottingham, and we have been serving the city since 2012.",
  },
  {
    icon: Route,
    title: "Drivers who know the city",
    text: "School run times, match day traffic and the quickest way round. We know them because we live here.",
  },
  {
    icon: Phone,
    title: "A local number to call",
    text: "Want to talk your booking through? Call 0115 8 244 244 and speak to Cloud Cars.",
  },
  {
    icon: PoundSterling,
    title: "Fixed price at booking",
    text: "You see your fare before you book, so there are no surprises at the end.",
  },
];

export default function LocalFirm() {
  return (
    <section
      id="local"
      aria-labelledby="local-heading"
      className="section-light bg-background py-20 lg:py-28"
    >
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Local, not a faceless app
          </span>

          <h2
            id="local-heading"
            className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Book local.{" "}
            <span className="text-gradient-green font-['Playfair_Display',serif] italic">
              Support Nottingham.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Cloud Cars has been a Nottingham company since 2012. When you book
            with us, you book with a business based in the city you are
            travelling in.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <FeatureCard
              key={p.title}
              icon={p.icon}
              title={p.title}
              text={p.text}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Book Online
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="tel:01158244244">
              <Phone className="mr-2 h-5 w-5" />
              0115 8 244 244
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
