import { Button } from "@/components/ui/button";
import {
  PoundSterling,
  Calendar,
  Car,
  Users,
  Shield,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: PoundSterling,
    title: "Weekly Pay",
    description:
      "Get paid every week directly to your bank account for completed work.",
  },
  {
    icon: Calendar,
    title: "Flexible Hours",
    description:
      "Full-time, part-time or weekends — work around your availability.",
  },
  {
    icon: Car,
    title: "Owner Drivers Welcome",
    description:
      "Have your own vehicle? Great. Need guidance on getting started? We can help.",
  },
  {
    icon: Users,
    title: "Local Team Support",
    description:
      "Join a proper Nottingham company with a real team behind you.",
  },
  {
    icon: Shield,
    title: "Professional Standards",
    description:
      "We work with drivers who value reliability, presentation, and excellent customer service.",
  },
  {
    icon: Briefcase,
    title: "Quality Work",
    description:
      "Access airport transfers, business travel, school transport, and regular local bookings.",
  },
];

export default function Drivers() {
  return (
    <section id="drivers" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Drivers Wanted
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Drive for{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Cloud Cars
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We are looking for professional private hire drivers in Nottingham
              who take pride in punctuality, presentation, and customer service.
              Join a growing local company focused on quality journeys and dependable service.
            </p>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
              <h4 className="font-semibold text-foreground mb-2">
                We are selective about who joins our team
              </h4>
              <p className="text-sm text-muted-foreground leading-6">
                We are not looking for just anyone. We want drivers who are
                friendly, knowledgeable, presentable, and genuinely committed to
                delivering a high standard of service.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-4">
                What You'll Need
              </h4>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  UK driving licence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Private hire badge or willingness to obtain one
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Good knowledge of Nottingham routes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Professional attitude and strong customer service
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Suitable vehicle if you plan to drive your own car
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Apply to Drive
            </h3>

            <p className="text-sm text-primary font-medium mb-2">
              We are currently recruiting a limited number of new drivers.
            </p>

            <p className="text-muted-foreground mb-6 leading-7">
              Learn more about driving opportunities with Cloud Cars, what we
              look for, and how to apply.
            </p>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6">
              <p className="text-sm font-medium text-foreground mb-2">
                Currently onboarding drivers licensed with:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Nottingham City Council
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Rushcliffe Borough Council
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
              >
                <a
                  href="/drive-for-cloud-cars"
                  className="inline-flex items-center justify-center"
                >
                  View Driver Opportunities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full py-6">
                <a href="tel:01158244244">Call 0115 8 244 244</a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6 leading-6">
              Drivers invited to join Cloud Cars will receive a separate secure
              onboarding link to upload vehicle and compliance documents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}