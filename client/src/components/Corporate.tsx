import { useState } from "react";
import { useCmsContent } from "@/hooks/useCmsContent";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Headphones,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const benefits = [
  {
    icon: CreditCard,
    title: "Clear Pricing",
    description:
      "Straightforward rates agreed in advance, helping your business plan and budget with confidence.",
  },
  {
    icon: FileText,
    title: "One Monthly Invoice",
    description:
      "All journeys on one clear invoice with a full breakdown for simple internal processing.",
  },
  {
    icon: Users,
    title: "Staff & Guest Travel",
    description:
      "Reliable transport for staff, visitors, clients, hotel guests, and scheduled journeys.",
  },
  {
    icon: BarChart3,
    title: "Journey Visibility",
    description:
      "A clearer view of travel activity, trip volumes, and transport usage across your account.",
  },
  {
    icon: Headphones,
    title: "Direct Support",
    description:
      "A responsive team you can contact directly when bookings need attention or flexibility.",
  },
  {
    icon: Building2,
    title: "Nottingham Based",
    description:
      "A local transport partner with real area knowledge, accountability, and long-term presence.",
  },
];

export default function Corporate() {
  const content = useCmsContent("corporate");

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    estimatedMonthlyTrips: "",
    requirements: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      toast.success("Thanks! We'll give you a call within 24 hours.");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="corporate" className="py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Business Accounts
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {content.title}{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                {content.subtitle}
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {content.description}
            </p>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
              <h3 className="text-base font-semibold text-foreground mb-2">
                Reliable transport for staff, guests, and business travel
              </h3>
              <p className="text-sm text-muted-foreground leading-6">
                Cloud Cars supports businesses with dependable transport for
                airport runs, staff travel, hotel guest movements, client
                collections, and scheduled journeys. We offer a more accountable,
                professional alternative to app-based uncertainty.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Enquiry Received
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Thanks for getting in touch. A member of our team will contact
                  you within 24 hours to discuss your business transport needs.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Open a Business Account
                </h3>
                <p className="text-muted-foreground mb-2">
                  Tell us a little about your organisation and the type of
                  journeys you need.
                </p>
                <p className="text-sm text-primary font-medium mb-6">
                  Suitable for staff travel, airport runs, hotel guests, visitor
                  transport, and repeat bookings.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="Your company"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@company.com"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="0115 123 4567"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedMonthlyTrips">
                      Estimated Monthly Journeys
                    </Label>
                    <Input
                      id="estimatedMonthlyTrips"
                      name="estimatedMonthlyTrips"
                      value={formData.estimatedMonthlyTrips}
                      onChange={handleChange}
                      placeholder="e.g. 20, 50-100, or ad hoc"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Your Requirements</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Tell us about staff transport, airport runs, client collections, hotel guest travel, regular routes, or any specific requirements..."
                      rows={4}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Request a Call Back"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}