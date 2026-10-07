import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Car, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  tagline?: string;
  highlight?: string;
  image?: string;
  imageClassName?: string;
  reassurances?: string[];
  icon?: LucideIcon;
};

export default function ServiceHero({
  eyebrow,
  title,
  description,
  ctaLabel = "Book Now",
  ctaHref = "https://book.cloudcarsltd.com/portal/#/booking",
  tagline,
  highlight,
  image,
  imageClassName = "object-[50%_40%]",
  reassurances = [],
  icon: Icon = Car,
}: ServiceHeroProps) {
  const split =
    highlight && title.endsWith(highlight)
      ? { lead: title.slice(0, title.length - highlight.length), accent: highlight }
      : null;

  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32">
      {image ? (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
          />
          <div className="absolute inset-0 bg-background/80 lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-background from-30% via-background/60 via-50% to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      ) : null}

      <div className="container relative z-10 max-w-6xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <Icon className="h-4 w-4" />
            {eyebrow}
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {split ? (
              <>
                {split.lead}
                <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                  {split.accent}
                </span>
              </>
            ) : (
              title
            )}
          </h1>

          {tagline ? (
            <p className="mt-5 text-xl font-medium text-foreground/90">{tagline}</p>
          ) : null}

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/70 bg-background/30 px-8 py-6 text-lg font-semibold text-foreground backdrop-blur-sm hover:bg-secondary/60"
            >
              <a href="tel:01158244244">
                <Phone className="mr-2 h-5 w-5" />
                0115 8 244 244
              </a>
            </Button>
          </div>

          {reassurances.length ? (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/90">
              {reassurances.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
