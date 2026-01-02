import { useState } from "react";
import { useCmsContent } from "@/hooks/useCmsContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PoundSterling,
  Calendar,
  Car,
  Users,
  Shield,
  TrendingUp,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const benefits = [
  {
    icon: PoundSterling,
    title: "Good Money",
    description:
      "Earn well with fair commission and weekly pay straight to your bank.",
  },
  {
    icon: Calendar,
    title: "Your Hours",
    description: "Full-time, part-time, weekends - you decide when you work.",
  },
  {
    icon: Car,
    title: "Car Sorted",
    description: "Got your own? Great. Need one? We can help with that too.",
  },
  {
    icon: Users,
    title: "Good People",
    description: "Join a proper team. Drivers who look out for each other.",
  },
  {
    icon: Shield,
    title: "Covered",
    description: "Full insurance while you're working. No worries.",
  },
  {
    icon: TrendingUp,
    title: "Move Up",
    description: "Training and opportunities to grow with us.",
  },
];

export default function Drivers() {
  const content = useCmsContent("drivers");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    yearsExperience: 0,
    vehicleOwner: false,
    vehicleType: "",
    availability: "" as "fulltime" | "parttime" | "weekends" | "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.availability) {
      toast.error("Please select your availability");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/driver-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          availability: formData.availability,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err?.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      toast.success("Application sent! We'll be in touch soon.");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <section id="drivers" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Join the Team
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {content.title}{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                {content.subtitle}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {content.description}
            </p>

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

            {/* Requirements */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-4">
                What You'll Need
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  UK driving licence (held for at least 3 years)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Private hire badge or happy to get one
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Clean DBS check
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Good knowledge of Nottingham
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Smart appearance and friendly manner
                </li>
              </ul>
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
                  Application Sent
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Thanks for applying. We'll have a look at your details and
                  give you a call within a couple of days.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Apply to Drive
                </h3>
                <p className="text-muted-foreground mb-6">
                  Fill in your details and we'll get back to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="bg-background"
                    />
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
                        placeholder="your@email.com"
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
                        placeholder="07xxx xxxxxx"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Licence Number *</Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required
                        placeholder="DVLA licence number"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years Driving *</Label>
                      <Input
                        id="yearsExperience"
                        name="yearsExperience"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        required
                        placeholder="0"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>When Can You Work? *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          availability: value as
                            | "fulltime"
                            | "parttime"
                            | "weekends",
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fulltime">Full-time</SelectItem>
                        <SelectItem value="parttime">Part-time</SelectItem>
                        <SelectItem value="weekends">Weekends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="vehicleOwner"
                      checked={formData.vehicleOwner}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          vehicleOwner: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="vehicleOwner" className="text-sm">
                      I have my own car
                    </Label>
                  </div>

                  {formData.vehicleOwner && (
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">What Car?</Label>
                      <Input
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        placeholder="e.g., Toyota Prius 2022"
                        className="bg-background"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Anything Else?</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us a bit about yourself..."
                      rows={3}
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
                      "Send Application"
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
