import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CourierServices() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">
          Courier Services Nottingham
        </h1>

        <p className="mb-6">
          Cloud Cars provides reliable same-day courier and parcel delivery services
          across Nottingham and surrounding areas for businesses and urgent deliveries.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Courier Services Include
        </h2>

        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>Same-day parcel delivery</li>
          <li>Business document delivery</li>
          <li>Hospital and medical runs</li>
          <li>Urgent local and regional jobs</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Courier Pricing
        </h2>

        <p className="mb-6">
          Courier pricing is based on a base fare, mileage and journey time, with
          competitive rates for urgent and scheduled deliveries.
        </p>

        <table className="table-auto border-collapse w-full mb-10">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Pricing Element</th>
              <th className="p-3 text-left">Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">Base Fare</td>
              <td className="p-3">£10</td>
            </tr>
            <tr>
              <td className="p-3">Per Mile</td>
              <td className="p-3">£2.20</td>
            </tr>
            <tr>
              <td className="p-3">Per Minute</td>
              <td className="p-3">£0.20</td>
            </tr>
            <tr>
              <td className="p-3">Minimum Fare</td>
              <td className="p-3">£15</td>
            </tr>
          </tbody>
        </table>

        <p>
          Contact Cloud Cars for dependable courier services in Nottingham for urgent
          and scheduled delivery requirements.
        </p>
      </main>

      <Footer />
    </div>
  );
}