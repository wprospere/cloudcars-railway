export default function Faqs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">How do I book?</h3>
          <p className="text-muted-foreground">
            Book online, call us, or email our bookings team.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Do you do airport transfers?</h3>
          <p className="text-muted-foreground">
            Yes — we offer airport transfers across the UK.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Do you provide corporate accounts?</h3>
          <p className="text-muted-foreground">
            Yes — we can set up monthly invoicing and account management.
          </p>
        </div>
      </div>
    </div>
  );
}
