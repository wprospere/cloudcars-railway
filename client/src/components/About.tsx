import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Award, Heart, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import path from "path";
import { useCmsContent, useCmsImage } from "@/hooks/useCmsContent";

// Single source of truth
const YEARS_IN_NOTTINGHAM = 12;

function useCountUp(trigger: boolean, to: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // Ease out
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (to - from) * eased);
      setValue(next);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, to, durationMs]);

  return value;
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
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export default function About() {
  const content = useCmsContent("about");
  // keeping your hook call (even though you weren't using it yet)
  useCmsImage(
    "about-image",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop"
  );

  const yearsLabel = useMemo(() => `${YEARS_IN_NOTTINGHAM}+`, []);
  const yearsSentence = useMemo(
    () => `${YEARS_IN_NOTTINGHAM} years on, we're still here and still doing things the same way.`,
    []
  );

  // Animate when section comes into view
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-20% 0px" });
  const yearsCount = useCountUp(inView, YEARS_IN_NOTTINGHAM, 900);

  return (
    <section
      id="about"
      className="py-20 lg:py-32"
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
                <motion.div
                  className="aspect-[4/5] rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
                    alt="Nottingham city skyline"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  className="aspect-square rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <img
                    src="/nottingham-council-house.jpg"
                    alt="Nottingham Council House and Old Market Square"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              <div className="space-y-4 pt-8">
                <motion.div
                  className="aspect-square rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <img
                    src="/uk-motorway.jpg"
                    alt="UK M1 motorway"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  className="aspect-[4/5] rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
                    alt="Business handshake"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Floating Badge (animated + responsive positioning) */}
            <motion.div
              className="
                absolute
                -bottom-6 -right-4
                sm:-right-6
                lg:right-8
                bg-primary text-primary-foreground
                rounded-2xl
                p-5 sm:p-6
                shadow-xl
                select-none
              "
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <div className="text-4xl font-bold mb-1 tabular-nums">
                {inView ? `${yearsCount}+` : yearsLabel}
              </div>
              <div className="text-sm opacity-90 leading-tight">
                Years in <br />
                Nottingham
              </div>
            </motion.div>
          </div>

          {/* Right Column – Content */}
          <div>
            <motion.span
              className="text-sm font-semibold text-primary uppercase tracking-wider"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
            >
              About Us
            </motion.span>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              {content.title}{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                {content.subtitle}
              </span>
            </motion.h2>

            <motion.div
              className="space-y-4 text-muted-foreground leading-relaxed mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p>{content.description}</p>

              <p>
                {yearsSentence} Our drivers live in Nottingham, know the streets,
                and take pride in getting you where you need to be. No apps that
                don't work, no call centres abroad – just a local company doing a
                proper job.
              </p>

              <p>
                Whether it's a quick run to the station, getting the kids to
                school, or regular airport trips for your business, we've got you
                covered.
              </p>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              className="grid sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
