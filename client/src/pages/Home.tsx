import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Corporate from "@/components/Corporate";
import Drivers from "@/components/Drivers";
import Trust from "@/components/Trust";
import AppPromo from "@/components/AppPromo";
import Booking from "@/components/Booking";
import About from "@/components/About";
import Sustainability from "@/components/Sustainability";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />

        <section id="services">
          <Services />
        </section>

        <Trust />

        <section id="corporate">
          <Corporate />
        </section>

        <section id="drivers">
          <Drivers />
        </section>

        <AppPromo />
        <Booking />
        <Sustainability />

        <section id="about">
          <About />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}