import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Award, Heart, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useCmsContent, useCmsImage } from "@/hooks/useCmsContent";

const YEARS_IN_NOTTINGHAM = 14;

function useScrollInView(
  ref: React.RefObject<HTMLElement | null>,
  { once = true, rootMargin = "0px" } = {}
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useCountUp(trigger: boolean, to: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, to, durationMs]);

  return value;
}

function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function Value({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export default function About() {
  const content = useCmsContent("about");
  useCmsImage(
    "about-image",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop"
  );

  const yearsLabel = useMemo(() => `${YEARS_IN_NOTTINGHAM}+`, []);
  const yearsSentence = useMemo(
    () => `${YEARS_IN_NOTTINGHAM} years on, the standards haven't changed — local drivers, local knowledge, proper service.`,
    []
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useScrollInView(sectionRef, {
    once: true,
    rootMargin: "-20% 0px",
  });
  const yearsCount = useCountUp(inView, YEARS_IN_NOTTINGHAM, 900);

  return (
    <section
      id="about"
      className="section-light bg-background py-20 lg:py-32"
      ref={(el) => {
        sectionRef.current = el;
      }}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column – Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FadeInUp className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
                    alt="Nottingham city skyline"
                    className="w-full h-full object-cover"
                  />
                </FadeInUp>

                <FadeInUp delay={50} className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="/nottingham-council-house.jpg"
                    alt="Nottingham Council House and Old Market Square"
                    className="w-full h-full object-cover"
                  />
                </FadeInUp>
              </div>

              <div className="space-y-4 pt-8">
                <FadeInUp delay={100} className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="/uk-motorway.jpg"
                    alt="UK M1 motorway"
                    className="w-full h-full object-cover"
                  />
                </FadeInUp>

                <FadeInUp delay={150} className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
                    alt="Business handshake"
                    className="w-full h-full object-cover"
                  />
                </FadeInUp>
              </div>
            </div>

            {/* Floating Badge */}
            <FadeInUp
              delay={200}
              className="absolute -bottom-6 -right-4 sm:-right-6 lg:right-8"
            >
              <div className="bg-primary text-primary-foreground rounded-2xl p-5 sm:p-6 shadow-xl select-none hover:-translate-y-[3px] hover:scale-[1.02] transition-transform duration-500 cursor-default">
                <div className="text-4xl font-bold mb-1 tabular-nums">
                  {inView ? `${yearsCount}+` : yearsLabel}
                </div>
                <div className="text-sm opacity-90 leading-tight">
                  Years in <br />
                  Nottingham
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Right Column – Content */}
          <div>
            <FadeInUp>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                About Us
              </span>
            </FadeInUp>

            <FadeInUp delay={50}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
                {content.title}{" "}
                <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                  {content.subtitle}
                </span>
              </h2>
            </FadeInUp>

            <FadeInUp delay={100}>
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                <p>{content.description}</p>
                <p>
                  {yearsSentence} Our drivers live in Nottingham, know the
                  streets, and take pride in getting you where you need to be.
                  No apps that don't work, no call centres abroad – just a local
                  company doing a proper job.
                </p>
                <p>
                  Whether it's a quick run to the station, getting the kids to
                  school, or regular airport trips for your business, we've got
                  you covered.
                </p>
              </div>
            </FadeInUp>

            <FadeInUp delay={150}>
              <div className="grid sm:grid-cols-2 gap-6">
                <Value
                  icon={<MapPin className="w-6 h-6 text-primary" />}
                  title="Local Knowledge"
                  text="We know Nottingham inside out. Every shortcut, every back road."
                />
                <Value
                  icon={<Award className="w-6 h-6 text-primary" />}
                  title="Done Right"
                  text="Clean cars, polite drivers, fair prices. The basics, done well."
                />
                <Value
                  icon={<Heart className="w-6 h-6 text-primary" />}
                  title="You Come First"
                  text="Your journey matters to us. We'll get you there safely."
                />
                <Value
                  icon={<Users className="w-6 h-6 text-primary" />}
                  title="Part of Nottingham"
                  text="We live here, work here, and support local businesses."
                />
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
