import { Button } from "@/components/ui/button";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function ServiceHero({
  eyebrow,
  title,
  description,
  ctaLabel = "Book Now",
  ctaHref = "https://book.cloudcarsltd.com/portal/#/booking",
}: ServiceHeroProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container max-w-6xl">
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
          {eyebrow}
        </span>

        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
          {title}
        </h1>

        <p className="text-lg text-muted-foreground max-w-3xl mb-8">
          {description}
        </p>

        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a href={ctaHref} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </a>
        </Button>
      </div>
    </section>
  );
}