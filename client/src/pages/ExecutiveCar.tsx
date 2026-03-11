import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ExecutiveCar() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">
          Executive Car Service Nottingham
        </h1>

        <p className="mb-6">
          Cloud Cars offers executive travel in Nottingham for business travel,
          airport transfers and professional transport requirements. Travel in comfort
          with premium vehicles and experienced drivers.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Executive Vehicle Options
        </h2>

        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>Mercedes E Class</li>
          <li>Audi A6</li>
          <li>Premium executive saloons</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Typical Executive Pricing
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
              <td className="p-3">£70</td>
            </tr>
            <tr>
              <td className="p-3">Birmingham Airport</td>
              <td className="p-3">£160</td>
            </tr>
            <tr>
              <td className="p-3">Manchester Airport</td>
              <td className="p-3">£210</td>
            </tr>
            <tr>
              <td className="p-3">Heathrow Airport</td>
              <td className="p-3">£330</td>
            </tr>
          </tbody>
        </table>

        <p>
          Book executive transport with Cloud Cars for reliable, professional and
          comfortable travel across Nottingham and beyond.
        </p>
      </main>

      <Footer />
    </div>
  );
}