import { Link } from "wouter";

const areas = [
  { name: "Beeston", slug: "/taxi-beeston" },
  { name: "West Bridgford", slug: "/taxi-west-bridgford" },
  { name: "Wollaton", slug: "/taxi-wollaton" },
  { name: "Edwalton", slug: "/taxi-edwalton" },
];

export default function Areas() {
  return (
    <div className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Local Coverage
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Taxi Services Across{" "}
            <span className="text-gradient-green font-['Playfair_Display',serif] italic">
              Nottingham
            </span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cloud Cars provides reliable taxi services across Nottingham and
            surrounding areas including airport transfers, executive travel,
            corporate transport and local journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <Link key={area.slug} href={area.slug}>
              <a
                className="block h-full rounded-2xl border border-border bg-card p-6 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label={`View taxi services in ${area.name}`}
              >
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Taxi {area.name}
                </h3>

                <p className="text-sm text-muted-foreground leading-6">
                  Reliable taxi service in {area.name} with airport transfers,
                  business travel and pre-booked journeys.
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}