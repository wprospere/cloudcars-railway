import { useState } from "react";
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
  Briefcase,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

const benefits = [
  {
    icon: PoundSterling,
    title: "Weekly Pay",
    description:
      "Get paid every week directly to your bank account for completed work.",
  },
  {
    icon: Calendar,
    title: "Flexible Hours",
    description:
      "Full-time, part-time or weekends — work around your availability.",
  },
  {
    icon: Car,
    title: "Owner Drivers Welcome",
    description:
      "Have your own vehicle? Great. Need guidance on getting started? We can help.",
  },
  {
    icon: Users,
    title: "Local Team Support",
    description:
      "Join a proper Nottingham company with a real team behind you.",
  },
  {
    icon: Shield,
    title: "Professional Standards",
    description:
      "We work with drivers who value reliability, presentation, and excellent customer service.",
  },
  {
    icon: Briefcase,
    title: "Quality Work",
    description:
      "Access airport transfers, business travel, school transport, and regular local bookings.",
  },
];

export default function Drivers() {
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

  const submitApplication = trpc.driver.submitApplication.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.availability) {
      toast.error("Please select your availability");
      return;
    }

    setIsSending(true);
    try {
      await submitApplication.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        yearsExperience: Number(formData.yearsExperience) || 0,
        vehicleOwner: Boolean(formData.vehicleOwner),
        vehicleType: formData.vehicleOwner
          ? formData.vehicleType || undefined
          : undefined,
        availability: formData.availability as
          | "fulltime"
          | "parttime"
          | "weekends",
        message: formData.message ? formData.message : undefined,
      });

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
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Drivers Wanted
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Drive for{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Cloud Cars
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We are looking for reliable private hire drivers in Nottingham who
              take pride in professionalism, punctuality, and customer service.
              Cloud Cars offers flexible driving opportunities with a growing
              local company focused on quality journeys and dependable service.
            </p>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
              <h4 className="font-semibold text-foreground mb-2">
                We are selective about who joins our team
              </h4>
              <p className="text-sm text-muted-foreground leading-6">
                We are not looking for just anyone. We want drivers who are
                friendly, knowledgeable, presentable, and genuinely committed to
                delivering a high standard of service. If that sounds like you,
                we’d love to hear from you.
              </p>
            </div>

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

            <div className="bg-card rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-4">
                What You'll Need
              </h4>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  UK driving licence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Private hire badge or willingness to obtain one
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Good knowledge of Nottingham routes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Professional attitude and strong customer service
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Suitable vehicle if you plan to drive your own car
                </li>
              </ul>
            </div>
          </div>

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
                  Thanks for applying to drive with Cloud Cars. We’ll review
                  your details and get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Apply to Drive
                </h3>

                <p className="text-sm text-primary font-medium mb-1">
                  We are currently recruiting a limited number of new drivers.
                </p>

                <p className="text-xs text-muted-foreground mb-4">
                  Most drivers complete this form in under 60 seconds. Prefer to
                  speak to someone? Call us on{" "}
                  <a
                    href="tel:01158244244"
                    className="text-primary font-semibold"
                  >
                    0115 8 244 244
                  </a>
                </p>

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Currently onboarding drivers licensed with:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Nottingham City Council
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Rushcliffe Borough Council
                    </li>
                  </ul>
                </div>

                <p className="text-muted-foreground mb-6">
                  Fill in your details and our team will review your application.
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
                      <Label htmlFor="yearsExperience">
                        Years Driving Experience *
                      </Label>
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
                      I have my own vehicle
                    </Label>
                  </div>

                  {formData.vehicleOwner && (
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Details</Label>
                      <Input
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        placeholder="e.g. Toyota Prius 2022"
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
                      placeholder="Tell us about your experience, badge status, vehicle or anything else useful..."
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