import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CorporateTransport() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">
          Corporate Transport Nottingham
        </h1>

        <p className="mb-6">
          Cloud Cars provides dependable corporate transport services in Nottingham for
          staff travel, business accounts, airport runs, hotel transport and scheduled
          journeys.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Corporate Services
        </h2>

        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>Staff transport</li>
          <li>Airport transfers</li>
          <li>Hotel and hospitality transport</li>
          <li>Account and invoice-based bookings</li>
          <li>Scheduled shuttle services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Why Choose Cloud Cars
        </h2>

        <p className="mb-6">
          We support businesses with reliable drivers, professional service and flexible
          transport solutions tailored to operational needs.
        </p>

        <p>
          To discuss a business account or regular transport support, contact Cloud Cars
          today.
        </p>
      </main>

      <Footer />
    </div>
  );
}