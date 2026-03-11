import { Helmet } from "react-helmet-async";

export default function TaxiNottingham() {
  return (
    <>
      <Helmet>
        <title>Taxi Nottingham | Cloud Cars</title>
        <meta
          name="description"
          content="Reliable taxi service in Nottingham for local journeys, business travel, airport transfers, and pre-booked transport with Cloud Cars."
        />
        <link rel="canonical" href="https://cloudcarsltd.com/taxi-nottingham" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <section className="py-16 lg:py-24">
          <div className="container max-w-5xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Cloud Cars Nottingham
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Taxi Service in Nottingham
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              Cloud Cars provides dependable taxi services across Nottingham for
              everyday travel, business journeys, local appointments, station runs,
              and pre-booked transport you can rely on.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="rounded-2xl border p-6 bg-card">
                <h2 className="text-xl font-semibold mb-3">Local Journeys</h2>
                <p className="text-muted-foreground">
                  Quick and reliable transport around Nottingham and surrounding areas.
                </p>
              </div>

              <div className="rounded-2xl border p-6 bg-card">
                <h2 className="text-xl font-semibold mb-3">Pre-Booked Travel</h2>
                <p className="text-muted-foreground">
                  Book ahead for peace of mind with fixed quoted pricing where applicable.
                </p>
              </div>

              <div className="rounded-2xl border p-6 bg-card">
                <h2 className="text-xl font-semibold mb-3">Professional Service</h2>
                <p className="text-muted-foreground">
                  Clean vehicles, experienced drivers, and dependable customer support.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border p-8 bg-card">
              <h2 className="text-2xl font-bold mb-4">Why choose Cloud Cars?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>Reliable local Nottingham transport</li>
                <li>Airport transfers and longer-distance bookings available</li>
                <li>Corporate and account work supported</li>
                <li>Standard and larger vehicle options available</li>
                <li>Friendly service with a professional approach</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}