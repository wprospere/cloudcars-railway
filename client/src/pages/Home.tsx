import { Helmet } from "react-helmet-async";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Areas from "@/components/Areas";
import Corporate from "@/components/Corporate";
import Drivers from "@/components/Drivers";
import Trust from "@/components/Trust";
import AppPromo from "@/components/AppPromo";
import Booking from "@/components/Booking";
import About from "@/components/About";
import Sustainability from "@/components/Sustainability";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import TrustBar from "@/components/TrustBar";

import RatingBar from "@/components/RatingBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* SEO */}
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

        {/* OpenGraph */}
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

        {/* Twitter */}
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

        {/* Schema.org */}
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
              "Edwalton"
            ],
            serviceType: [
              "Taxi Service",
              "Airport Transfers",
              "Executive Car Service",
              "Corporate Transport",
              "Courier Services",
              "7 Seater Taxi"
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nottingham",
              addressCountry: "GB"
            }
          })}
        </script>
      </Helmet>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">

        {/* Hero */}
        <Hero />
<RatingBar />
<TrustBar />

        {/* Services */}
        <section id="services" className="scroll-mt-28">
          <Services />
        </section>

        {/* Local Areas */}
        <section id="areas" className="scroll-mt-28">
          <Areas />
        </section>

        {/* Trust */}
        <section id="trust" className="scroll-mt-28">
          <Trust />
        </section>

        {/* Corporate */}
        <section id="corporate" className="scroll-mt-28">
          <Corporate />
        </section>

        {/* Drivers */}
        <section id="drivers" className="scroll-mt-28">
          <Drivers />
        </section>

        {/* App Promo */}
        <section id="app" className="scroll-mt-28">
          <AppPromo />
        </section>

        {/* Booking */}
        <section id="booking" className="scroll-mt-28">
          <Booking />
        </section>

        {/* Sustainability */}
        <section id="sustainability" className="scroll-mt-28">
          <Sustainability />
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-28">
          <About />
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-28">
          <Contact />
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}