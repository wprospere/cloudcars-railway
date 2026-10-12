import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import PageMeta from "@/components/PageMeta";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RatingBar from "@/components/RatingBar";
import TrustBar from "@/components/TrustBar";

// Below-fold sections — code-split out of the main bundle
const Services = lazy(() => import("@/components/Services"));
const Booking = lazy(() => import("@/components/Booking"));
const Corporate = lazy(() => import("@/components/Corporate"));
const Trust = lazy(() => import("@/components/Trust"));
const Sustainability = lazy(() => import("@/components/Sustainability"));
const Areas = lazy(() => import("@/components/Areas"));
const AppPromo = lazy(() => import("@/components/AppPromo"));
const Drivers = lazy(() => import("@/components/Drivers"));
const About = lazy(() => import("@/components/About"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/" />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: "Cloud Cars",
            url: "https://cloudcarsltd.com/",
            logo: "https://cloudcarsltd.com/logo.png",
            telephone: "+441158244244",
            priceRange: "££",
            areaServed: [
              "Nottingham",
              "Beeston",
              "West Bridgford",
              "Wollaton",
              "Edwalton",
            ],
            serviceType: [
              "Taxi Service",
              "Airport Transfers",
              "Executive Car Service",
              "Corporate Transport",
              "Courier Services",
              "7 Seater Taxi",
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nottingham",
              addressCountry: "GB",
            },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="flex-1">
        <Hero />
        <RatingBar />
        <TrustBar />

        {/* Passenger journey: services → book */}
        <section id="services" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[800px]" />}>
            <Services />
          </Suspense>
        </section>

        {/* Corporate early-entry strip */}
        <div className="section-light bg-card border-y border-primary/20 py-7">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">Travelling for work?</p>
                <p className="text-sm text-muted-foreground">
                  Set up a business account for invoiced journeys, staff bookings, and a team who answers the phone.
                </p>
              </div>
              <a
                href="#corporate"
                onClick={(e) => {
                  e.preventDefault();
                  const w = window as any;
                  if (typeof w.gtag === "function") w.gtag("event", "cta_click", { location: "corporate_strip", cta: "corporate_accounts" });
                  document.querySelector("#corporate")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="shrink-0 text-sm font-semibold text-primary border border-primary/40 rounded-lg px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
              >
                Learn about corporate accounts →
              </a>
            </div>
          </div>
        </div>

        <section id="booking" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[900px]" />}>
            <Booking />
          </Suspense>
        </section>

        <section id="corporate" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <Corporate />
          </Suspense>
        </section>

        {/* Credibility sections — for visitors who want to know more */}
        <section id="trust" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <Trust />
          </Suspense>
        </section>

        <section id="sustainability" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <Sustainability />
          </Suspense>
        </section>

        <section id="areas" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <Areas />
          </Suspense>
        </section>

        <section id="app" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <AppPromo />
          </Suspense>
        </section>

        <section id="drivers" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <Drivers />
          </Suspense>
        </section>

        <section id="about" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <About />
          </Suspense>
        </section>

        <section id="contact" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <Contact />
          </Suspense>
        </section>
      </main>

      <Suspense fallback={<div className="min-h-[320px]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}