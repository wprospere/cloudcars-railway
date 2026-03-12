import { Link } from "wouter";

const areas = [
  { name: "Beeston", slug: "/taxi-beeston" },
  { name: "West Bridgford", slug: "/taxi-west-bridgford" },
  { name: "Wollaton", slug: "/taxi-wollaton" },
  { name: "Edwalton", slug: "/taxi-edwalton" },
];

export default function Areas() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container max-w-6xl">

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {areas.map((area) => (
            <Link key={area.slug} href={area.slug}>
              <a className="bg-card rounded-2xl border border-border p-6 card-hover">

                <h3 className="font-semibold text-lg mb-2">
                  Taxi {area.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  Reliable taxi service in {area.name} with airport transfers,
                  business travel and pre-booked journeys.
                </p>

              </a>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}