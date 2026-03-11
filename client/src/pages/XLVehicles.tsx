import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function XL() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">
          7 Seater Taxi Nottingham
        </h1>

        <p className="mb-6">
          Cloud Cars provides spacious 7 seater transport in Nottingham for airport
          transfers, family travel, group bookings and corporate journeys.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Ideal For
        </h2>

        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>Airport transfers</li>
          <li>Family travel</li>
          <li>Business teams</li>
          <li>Extra luggage</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Typical XL Pricing
        </h2>

        <table className="table-auto border-collapse w-full mb-10">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Journey</th>
              <th className="p-3 text-left">From</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">East Midlands Airport</td>
              <td className="p-3">£75</td>
            </tr>
            <tr>
              <td className="p-3">Birmingham Airport</td>
              <td className="p-3">£170</td>
            </tr>
            <tr>
              <td className="p-3">Manchester Airport</td>
              <td className="p-3">£220</td>
            </tr>
            <tr>
              <td className="p-3">Heathrow Airport</td>
              <td className="p-3">£360</td>
            </tr>
          </tbody>
        </table>

        <p>
          Our XL vehicles are ideal for group travel with comfort, space and dependable
          service from Cloud Cars.
        </p>
      </main>

      <Footer />
    </div>
  );
}