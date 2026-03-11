import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

export default function AirportTransfers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Airport Transfers Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Reliable airport transfers from Nottingham to Heathrow, Birmingham, Manchester and East Midlands Airport. Fixed prices and professional drivers."
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">
          Airport Transfers Nottingham
        </h1>

        <p className="mb-6">
          Cloud Cars provides reliable airport transfers from Nottingham to all major UK airports.
          Our professional drivers ensure you arrive on time with comfortable vehicles and fixed pricing.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Popular Airport Routes
        </h2>

        <table className="table-auto border-collapse w-full mb-10">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Airport</th>
              <th className="p-3 text-left">Standard</th>
              <th className="p-3 text-left">Executive</th>
              <th className="p-3 text-left">XL</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-3">East Midlands Airport</td>
              <td className="p-3">£40</td>
              <td className="p-3">£70</td>
              <td className="p-3">£75</td>
            </tr>

            <tr>
              <td className="p-3">Birmingham Airport</td>
              <td className="p-3">£110</td>
              <td className="p-3">£160</td>
              <td className="p-3">£170</td>
            </tr>

            <tr>
              <td className="p-3">Manchester Airport</td>
              <td className="p-3">£150</td>
              <td className="p-3">£210</td>
              <td className="p-3">£220</td>
            </tr>

            <tr>
              <td className="p-3">Heathrow Airport</td>
              <td className="p-3">£260</td>
              <td className="p-3">£330</td>
              <td className="p-3">£360</td>
            </tr>
          </tbody>
        </table>

        <p>
          Book your airport transfer today with Cloud Cars for dependable service,
          professional drivers and competitive pricing.
        </p>
      </main>

      <Footer />
    </div>
  );
}