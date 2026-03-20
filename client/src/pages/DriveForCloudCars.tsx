import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PoundSterling,
  Calendar,
  Car,
  Users,
  Shield,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { api } from "@/utils/api";

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

const applicationSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  postcode: z.string().min(2, "Please enter your postcode"),
  badgeType: z.string().min(1, "Please select your badge type"),
  availability: z.string().min(1, "Please select your availability"),
  licenceYears: z.string().min(1, "Please enter how long you have held your licence"),
  hasOwnVehicle: z.boolean().default(false),
  vehicleType: z.string().optional(),
  experience: z.string().min(10, "Please tell us a little about your experience"),
  notes: z.string().optional(),
  agreeToContact: z.boolean().refine((val) => val === true, {
    message: "You must agree before submitting",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const defaultValues: ApplicationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postcode: "",
  badgeType: "",
  availability: "",
  licenceYears: "",
  hasOwnVehicle: false,
  vehicleType: "",
  experience: "",
  notes: "",
  agreeToContact: false,
};

export default function DriveForCloudCars() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });

  const hasOwnVehicle = form.watch("hasOwnVehicle");

  const submitApplication = api.driver.submitApplication.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset(defaultValues);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const onSubmit = (values: ApplicationFormValues) => {
    submitApplication.mutate({
      ...values,
      hasOwnVehicle: values.hasOwnVehicle ?? false,
      agreeToContact: values.agreeToContact ?? false,
      vehicleType: values.hasOwnVehicle ? values.vehicleType : "",
    });
  };

  return (
    <section id="drivers" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
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
              We are looking for professional private hire drivers in Nottingham
              who take pride in punctuality, presentation, and customer service.
              Join a growing local company focused on quality journeys and dependable service.
            </p>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
              <h4 className="font-semibold text-foreground mb-2">
                We are selective about who joins our team
              </h4>
              <p className="text-sm text-muted-foreground leading-6">
                We are not looking for just anyone. We want drivers who are
                friendly, knowledgeable, presentable, and genuinely committed to
                delivering a high standard of service.
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
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Application Submitted
                </h3>

                <p className="text-muted-foreground mb-6 leading-7">
                  Thank you for applying to drive with Cloud Cars. A member of
                  our team will review your application and be in touch.
                </p>

                <Button type="button" onClick={() => setIsSubmitted(false)} className="w-full">
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Apply to Drive
                </h3>

                <p className="text-sm text-primary font-medium mb-2">
                  We are currently recruiting a limited number of new drivers.
                </p>

                <p className="text-muted-foreground mb-6 leading-7">
                  Complete the form below and tell us a bit about yourself,
                  your licence, and your availability.
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          className="pl-10"
                          placeholder="First name"
                        />
                      </div>
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          className="pl-10"
                          placeholder="Last name"
                        />
                      </div>
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          className="pl-10"
                          placeholder="you@example.com"
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          className="pl-10"
                          placeholder="Phone number"
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        id="postcode"
                        {...form.register("postcode")}
                        className="pl-10"
                        placeholder="Postcode"
                      />
                    </div>
                    {form.formState.errors.postcode && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.postcode.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Badge type</Label>
                      <Select
                        value={form.watch("badgeType")}
                        onValueChange={(value) =>
                          form.setValue("badgeType", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select badge type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nottingham-city">
                            Nottingham City Council
                          </SelectItem>
                          <SelectItem value="rushcliffe">
                            Rushcliffe Borough Council
                          </SelectItem>
                          <SelectItem value="other">Other council</SelectItem>
                          <SelectItem value="not-licensed">Not licensed yet</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.badgeType && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.badgeType.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <Select
                        value={form.watch("availability")}
                        onValueChange={(value) =>
                          form.setValue("availability", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="weekends">Weekends</SelectItem>
                          <SelectItem value="school-runs">School runs only</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.availability && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.availability.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenceYears">How long have you held your licence?</Label>
                    <Input
                      id="licenceYears"
                      {...form.register("licenceYears")}
                      placeholder="e.g. 5 years"
                    />
                    {form.formState.errors.licenceYears && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.licenceYears.message}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="hasOwnVehicle"
                        checked={form.watch("hasOwnVehicle") ?? false}
                        onCheckedChange={(checked) =>
                          form.setValue("hasOwnVehicle", checked === true, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <div className="space-y-1">
                        <Label htmlFor="hasOwnVehicle" className="cursor-pointer">
                          I have my own vehicle
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Tick this if you already have a suitable vehicle.
                        </p>
                      </div>
                    </div>
                  </div>

                  {hasOwnVehicle && (
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle type</Label>
                      <div className="relative">
                        <Car className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="vehicleType"
                          {...form.register("vehicleType")}
                          className="pl-10"
                          placeholder="e.g. Saloon, Estate, MPV, 8 Seater"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      {...form.register("experience")}
                      placeholder="Tell us about your driving experience, local knowledge, customer service, airport work, school runs, or anything else relevant."
                      className="min-h-[120px]"
                    />
                    {form.formState.errors.experience && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional notes</Label>
                    <Textarea
                      id="notes"
                      {...form.register("notes")}
                      placeholder="Anything else you would like us to know?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agreeToContact"
                        checked={form.watch("agreeToContact") ?? false}
                        onCheckedChange={(checked) =>
                          form.setValue("agreeToContact", checked === true, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <div className="space-y-1">
                        <Label htmlFor="agreeToContact" className="cursor-pointer">
                          I agree to be contacted about my application
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          By submitting this form, you consent to Cloud Cars
                          contacting you regarding your application.
                        </p>
                      </div>
                    </div>
                    {form.formState.errors.agreeToContact && (
                      <p className="text-sm text-destructive mt-2">
                        {form.formState.errors.agreeToContact.message}
                      </p>
                    )}
                  </div>

                  {submitApplication.error && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                      <p className="text-sm text-destructive">
                        {submitApplication.error.message ||
                          "Something went wrong while submitting your application. Please try again."}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <Button
                      type="submit"
                      disabled={submitApplication.isPending}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                    >
                      {submitApplication.isPending ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Application...
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          Submit Application
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                      )}
                    </Button>

                    <Button asChild variant="outline" className="w-full py-6">
                      <a href="tel:01158244244">Call 0115 8 244 244</a>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-6">
                    Drivers invited to join Cloud Cars will receive a separate
                    secure onboarding link to upload vehicle and compliance documents.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}