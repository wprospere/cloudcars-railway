import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
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

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

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

export default function DriveForCloudCars() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>Drive for Cloud Cars | Private Hire Driver Jobs Nottingham</title>
        <meta
          name="description"
          content="Apply to drive for Cloud Cars in Nottingham. Private hire driver opportunities with weekly pay, flexible hours, local support, and quality work."
        />
        <link rel="canonical" href="https://cloudcarsltd.com/drive-for-cloud-cars" />
      </Helmet>

      <Header />

      <main className="flex-1">
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container">
            <div className="max-w-4xl">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Driver Recruitment
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
                Drive for{" "}
                <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                  Cloud Cars
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                We are looking for professional private hire drivers in Nottingham
                who take pride in punctuality, presentation, and customer service.
                Join a growing local company focused on quality journeys and trusted transport.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="px-8 py-6 text-lg">
                  <a href="#apply">
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>

                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <a href="tel:01158244244">Call 0115 8 244 244</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                We are selective about who joins our team
              </h2>
              <p className="text-muted-foreground leading-7 max-w-3xl">
                We are not looking for just anyone. We want drivers who are friendly,
                knowledgeable, presentable, and genuinely committed to delivering
                a high standard of service. If that sounds like you, we would love to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-6">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  What You&apos;ll Need
                </h2>

                <ul className="space-y-3 text-sm text-muted-foreground">
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

              <div id="apply" className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Ready to Apply?
                </h2>
                <p className="text-muted-foreground mb-6 leading-7">
                  To keep standards high, we review applications before inviting
                  drivers to complete onboarding and document upload.
                </p>

                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/#drivers">Apply Through Homepage Form</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <a href="tel:01158244244">Call the Team</a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Invited drivers will receive a separate secure onboarding link
                  to upload vehicle and compliance documents.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}