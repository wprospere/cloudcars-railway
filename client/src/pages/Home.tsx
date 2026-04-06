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

function QuickBookerEmbed() {
  return (
    <section className="mt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Book online with instant quote
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">
              Enter your pickup and drop-off, choose your vehicle, and book your
              journey in seconds using our secure online booking system.
            </p>
          </div>

          <iframe
            src="https://book.cloudcarsltd.com/qb/#/?token=DCFvUodLCOojAxpf"
            title="Cloud Cars QuickBooker"
            className="w-full h-[720px] md:h-[820px]"
            frameBorder="0"
            scrolling="yes"
          />
        </div>
      </div>
    </section>
  );
}

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
        <RatingBar />
        <TrustBar />

        <section id="trust" className="scroll-mt-28">
          <Trust />
        </section>

        <section id="services" className="scroll-mt-28">
          <Services />
        </section>

        <section id="booking" className="scroll-mt-28">
          <Booking />
          <QuickBookerEmbed />
        </section>

        <section id="corporate" className="scroll-mt-28">
          <Corporate />
        </section>

        <section id="areas" className="scroll-mt-28">
          <Areas />
        </section>

        <section id="app" className="scroll-mt-28">
          <AppPromo />
        </section>

        <section id="drivers" className="scroll-mt-28">
          <Drivers />
        </section>

        <section id="sustainability" className="scroll-mt-28">
          <Sustainability />
        </section>

        <section id="about" className="scroll-mt-28">
          <About />
        </section>

        <section id="contact" className="scroll-mt-28">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}