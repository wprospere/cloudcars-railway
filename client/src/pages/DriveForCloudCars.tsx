import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
  FileBadge,
} from "lucide-react";
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

const applicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  licenseNumber: z.string().min(2, "Please enter your licence or badge number"),
  yearsExperience: z.coerce
    .number()
    .min(0, "Please enter valid years of experience"),
  availability: z.enum(["fulltime", "parttime", "weekends"]),
  vehicleOwner: z.boolean().optional().default(false),
  vehicleType: z.string().optional(),
  message: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const defaultValues: ApplicationFormValues = {
  fullName: "",
  email: "",
  phone: "",
  licenseNumber: "",
  yearsExperience: 0,
  availability: "parttime",
  vehicleOwner: false,
  vehicleType: "",
  message: "",
};

export default function DriveForCloudCars() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues,
  });

  const vehicleOwner = form.watch("vehicleOwner");

  const submitApplication = trpc.driver.submitApplication.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset(defaultValues);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const onSubmit: SubmitHandler<ApplicationFormValues> = (values) => {
    submitApplication.mutate({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      licenseNumber: values.licenseNumber,
      yearsExperience: Number(values.yearsExperience),
      availability: values.availability,
      vehicleOwner: values.vehicleOwner ?? false,
      vehicleType: values.vehicleOwner ? values.vehicleType : "",
      message: values.message,
    });
  };

  return (
    <section id="drivers" className="bg-secondary/30 py-20 lg:py-32">
      <div className="container">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Drivers Wanted
            </span>

            <h2 className="text-foreground mt-3 mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Drive for{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Cloud Cars
              </span>
            </h2>

            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              We are looking for professional private hire drivers in Nottingham
              who take pride in punctuality, presentation, and customer service.
              Join a growing local company focused on quality journeys and
              dependable service.
            </p>

            <div className="border-primary/20 bg-primary/5 mb-8 rounded-xl border p-5">
              <h4 className="text-foreground mb-2 font-semibold">
                We are selective about who joins our team
              </h4>
              <p className="text-muted-foreground text-sm leading-6">
                We are not looking for just anyone. We want drivers who are
                friendly, knowledgeable, presentable, and genuinely committed to
                delivering a high standard of service.
              </p>
            </div>

            <div className="mb-10 grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <benefit.icon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1 font-semibold">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border-border rounded-xl border p-6">
              <h4 className="text-foreground mb-4 font-semibold">
                What You'll Need
              </h4>

              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  UK driving licence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  Private hire badge or willingness to obtain one
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  Good knowledge of Nottingham routes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  Professional attitude and strong customer service
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  Suitable vehicle if you plan to drive your own car
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card border-border rounded-2xl border p-6 lg:p-8">
            {isSubmitted ? (
              <div className="py-6 text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                  <CheckCircle2 className="text-primary h-7 w-7" />
                </div>

                <h3 className="text-foreground mb-3 text-2xl font-bold">
                  Application Submitted
                </h3>

                <p className="text-muted-foreground mb-6 leading-7">
                  Thank you for applying to drive with Cloud Cars. A member of
                  our team will review your application and be in touch.
                </p>

                <Button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-foreground mb-3 text-2xl font-bold">
                  Apply to Drive
                </h3>

                <p className="text-primary mb-2 text-sm font-medium">
                  We are currently recruiting a limited number of new drivers.
                </p>

                <p className="text-muted-foreground mb-6 leading-7">
                  Complete the form below and tell us a bit about yourself, your
                  licence, and your availability.
                </p>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="fullName"
                        {...form.register("fullName")}
                        className="pl-10"
                        placeholder="Full name"
                      />
                    </div>
                    {form.formState.errors.fullName && (
                      <p className="text-destructive text-sm">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          className="pl-10"
                          placeholder="you@example.com"
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <div className="relative">
                        <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          className="pl-10"
                          placeholder="Phone number"
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">
                        Licence / badge number
                      </Label>
                      <div className="relative">
                        <FileBadge className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          id="licenseNumber"
                          {...form.register("licenseNumber")}
                          className="pl-10"
                          placeholder="Enter licence or badge number"
                        />
                      </div>
                      {form.formState.errors.licenseNumber && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.licenseNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">
                        Years of experience
                      </Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        min="0"
                        step="1"
                        {...form.register("yearsExperience")}
                        placeholder="e.g. 5"
                      />
                      {form.formState.errors.yearsExperience && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.yearsExperience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select
                      value={form.watch("availability")}
                      onValueChange={(value) =>
                        form.setValue(
                          "availability",
                          value as "fulltime" | "parttime" | "weekends",
                          { shouldValidate: true }
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fulltime">Full-time</SelectItem>
                        <SelectItem value="parttime">Part-time</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.availability && (
                      <p className="text-destructive text-sm">
                        Please select your availability
                      </p>
                    )}
                  </div>

                  <div className="border-primary/20 bg-primary/5 rounded-xl border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="vehicleOwner"
                        checked={form.watch("vehicleOwner") ?? false}
                        onCheckedChange={(checked) =>
                          form.setValue("vehicleOwner", checked === true, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="vehicleOwner"
                          className="cursor-pointer"
                        >
                          I have my own vehicle
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Tick this if you already have a suitable vehicle.
                        </p>
                      </div>
                    </div>
                  </div>

                  {vehicleOwner && (
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle type</Label>
                      <div className="relative">
                        <Car className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
                    <Label htmlFor="message">Additional information</Label>
                    <Textarea
                      id="message"
                      {...form.register("message")}
                      placeholder="Tell us about your driving experience, local knowledge, customer service, airport work, school runs, or anything else relevant."
                      className="min-h-[120px]"
                    />
                  </div>

                  {submitApplication.error && (
                    <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-4">
                      <p className="text-destructive text-sm">
                        {submitApplication.error.message ||
                          "Something went wrong while submitting your application. Please try again."}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <Button
                      type="submit"
                      disabled={submitApplication.isPending}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-6 font-semibold"
                    >
                      {submitApplication.isPending ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting Application...
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          Submit Application
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    <Button asChild variant="outline" className="w-full py-6">
                      <a href="tel:01158244244">Call 0115 8 244 244</a>
                    </Button>
                  </div>

                  <p className="text-muted-foreground text-xs leading-6">
                    Drivers invited to join Cloud Cars will receive a separate
                    secure onboarding link to upload vehicle and compliance
                    documents.
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