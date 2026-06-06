import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EcoStrip from "@/components/EcoStrip";
import RatingBar from "@/components/RatingBar";
import TrustBar from "@/components/TrustBar";
import Sustainability from "@/components/Sustainability";
import Trust from "@/components/Trust";
import Services from "@/components/Services";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

// Below-fold sections — loaded after the critical path paints
const Corporate = lazy(() => import("@/components/Corporate"));
const Areas = lazy(() => import("@/components/Areas"));
const AppPromo = lazy(() => import("@/components/AppPromo"));
const Drivers = lazy(() => import("@/components/Drivers"));
const About = lazy(() => import("@/components/About"));
const Contact = lazy(() => import("@/components/Contact"));

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>
          Taxi Nottingham | Airport Transfers & Corporate Travel | Cloud Cars
        </title>

        <meta
          name="description"
          content="Cloud Cars provides reliable taxi services in Nottingham including airport transfers, executive cars, corporate travel, courier services and pre-booked transport."
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="canonical" href="https://cloudcarsltd.com/" />

        <meta
          property="og:title"
          content="Taxi Nottingham | Airport Transfers & Corporate Travel | Cloud Cars"
        />
        <meta
          property="og:description"
          content="Reliable taxi services in Nottingham including airport transfers, corporate travel, executive cars and courier services."
        />
        <meta property="og:url" content="https://cloudcarsltd.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cloudcarsltd.com/logo.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Taxi Nottingham | Airport Transfers | Cloud Cars"
        />
        <meta
          name="twitter:description"
          content="Reliable taxi service in Nottingham including airport transfers, corporate travel and executive cars."
        />
        <meta name="twitter:image" content="https://cloudcarsltd.com/logo.png" />

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
        <EcoStrip />
        <RatingBar />
        <TrustBar />

        <section id="sustainability" className="scroll-mt-28">
          <Sustainability />
        </section>

        <section id="trust" className="scroll-mt-28">
          <Trust />
        </section>

        <section id="services" className="scroll-mt-28">
          <Services />
        </section>

        <section id="booking" className="scroll-mt-28">
          <Booking />
        </section>

        <section id="corporate" className="scroll-mt-28">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <Corporate />
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

      <Footer />
    </div>
  );
}