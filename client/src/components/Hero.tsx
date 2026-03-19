import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { useCmsContent, useCmsImage } from "@/hooks/useCmsContent";

export default function Hero() {
  const content = useCmsContent("hero");
  const heroImage = useCmsImage(
    "hero-background",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
  );

  return (
    <section className="relative min-h-screen flex items-center pt-24 lg:pt-28 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-[1px]"
          style={{
            backgroundImage: `url('${heroImage.url}')`,
          }}
        />

        {/* Premium overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Soft ambient glow */}
      <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Your Nottingham Taxi Partner
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6 max-w-4xl">
            <span className="text-foreground">{content.title}</span>
            <br />
            <span className="text-gradient-green font-['Playfair_Display',serif] italic">
              {content.subtitle}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            {content.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group shadow-sm"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.buttonText || "Book Your Ride"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.querySelector("#corporate");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-border/70 bg-background/30 backdrop-blur-sm hover:bg-secondary/60 text-foreground font-semibold px-8 py-6 text-lg"
            >
              Business Accounts
            </Button>
          </div>

          {/* Driver trust message */}
          <p className="text-sm text-muted-foreground mt-4 mb-8 max-w-xl leading-relaxed">
            Drivers are friendly, knowledgeable and personally selected — not just approved online.
            No strangers behind the wheel.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-4 lg:gap-6">
            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm px-4 py-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Safe & Secure
                </p>
                <p className="text-xs text-muted-foreground">
                  DBS Checked Drivers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm px-4 py-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Always On Time
                </p>
                <p className="text-xs text-muted-foreground">
                  24/7 Availability
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm px-4 py-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Local Experts
                </p>
                <p className="text-xs text-muted-foreground">
                  Serving Nottingham
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
        <div className="w-6 h-10 rounded-full border border-muted-foreground/30 bg-background/20 backdrop-blur-sm flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}