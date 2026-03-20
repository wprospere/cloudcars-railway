import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
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

  const scrollToForm = () => {
    document
      .getElementById("application-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Header />

      <main className="pt-16 lg:pt-20">
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-secondary/40 py-16 lg:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="container relative">
            <div className="mb-8">
              <a
                href="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </a>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Drivers Wanted
                </span>

                <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Drive for{" "}
                  <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                    Cloud Cars
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground lg:text-xl">
                  Join a professional Nottingham private hire company focused on
                  quality journeys, reliable service, and drivers who take pride
                  in what they do.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={scrollToForm}
                    className="bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="px-8 font-semibold"
                  >
                    <a href="tel:01158244244">Call Us First</a>
                  </Button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                    <p className="text-2xl font-bold text-foreground">Weekly</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pay direct to your bank
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                    <p className="text-2xl font-bold text-foreground">Flexible</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Full-time, part-time or weekends
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                    <p className="text-2xl font-bold text-foreground">Local</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Nottingham team support
                    </p>
                  </div>
                </div>

                <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    We are selective about who joins our team
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    We are not looking for just anyone. We want drivers who are
                    friendly, knowledgeable, presentable, and genuinely committed
                    to delivering a high standard of service.
                  </p>
                </div>
              </div>

              <div>
                <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-xl lg:p-8">
                  {isSubmitted ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>

                      <h3 className="text-2xl font-bold text-foreground">
                        Application Submitted
                      </h3>

                      <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">
                        Thank you for applying to drive with Cloud Cars. A member
                        of our team will review your application and be in touch.
                      </p>

                      <Button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 w-full"
                      >
                        Submit Another Application
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-foreground">
                          Apply to Drive
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-primary">
                          Limited driver positions available this month
                        </p>

                        <p className="mt-3 leading-7 text-muted-foreground">
                          Complete the form below and tell us about your
                          experience, availability, and whether you have your own
                          vehicle.
                        </p>
                      </div>

                      <div className="mb-6 rounded-2xl border border-border/60 bg-secondary/40 p-4">
                        <h4 className="font-semibold text-foreground">
                          Why drivers choose Cloud Cars
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          <li>• Consistent work including airport, corporate and school runs</li>
                          <li>• Weekly payments with local office support</li>
                          <li>• Professional bookings, not low-quality fares</li>
                          <li>• A company that values standards and reliability</li>
                        </ul>
                      </div>

                      <form
                        id="application-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full name</Label>
                          <div className="relative">
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="fullName"
                              {...form.register("fullName")}
                              className="pl-10"
                              placeholder="Full name"
                            />
                          </div>
                          {form.formState.errors.fullName && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <div className="relative">
                              <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                              <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="licenseNumber">
                              Licence / badge number
                            </Label>
                            <div className="relative">
                              <FileBadge className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="licenseNumber"
                                {...form.register("licenseNumber")}
                                className="pl-10"
                                placeholder="Enter licence or badge number"
                              />
                            </div>
                            {form.formState.errors.licenseNumber && (
                              <p className="text-sm text-destructive">
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
                              <p className="text-sm text-destructive">
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
                            <p className="text-sm text-destructive">
                              Please select your availability
                            </p>
                          )}
                        </div>

                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
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
                              <p className="text-sm text-muted-foreground">
                                Tick this if you already have a suitable vehicle.
                              </p>
                            </div>
                          </div>
                        </div>

                        {vehicleOwner && (
                          <div className="space-y-2">
                            <Label htmlFor="vehicleType">Vehicle type</Label>
                            <div className="relative">
                              <Car className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
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
                            className="w-full py-6 font-semibold text-primary-foreground bg-primary hover:bg-primary/90"
                          >
                            {submitApplication.isPending ? (
                              <span className="inline-flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting Application...
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center">
                                Apply to Drive
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </span>
                            )}
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            className="w-full py-6 font-semibold"
                          >
                            <a href="tel:01158244244">Call 0115 8 244 244</a>
                          </Button>
                        </div>

                        <div className="rounded-2xl bg-secondary/50 p-4 text-sm text-muted-foreground">
                          <p className="mb-1 font-medium text-foreground">
                            What happens next?
                          </p>
                          <p>
                            We review applications within 24–48 hours. If your
                            application looks suitable, we will contact you to
                            discuss onboarding and next steps.
                          </p>
                        </div>

                        <p className="text-xs leading-6 text-muted-foreground">
                          Drivers invited to join Cloud Cars will receive a
                          separate secure onboarding link to upload vehicle and
                          compliance documents.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 bg-background py-16 lg:py-20">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">
                  What You'll Need
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    UK driving licence
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Private hire badge or willingness to obtain one
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Good knowledge of Nottingham routes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Professional attitude and strong customer service
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Suitable vehicle if you plan to drive your own car
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">
                  Looking for quality drivers, not just numbers
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Cloud Cars is building a driver team that reflects the
                  standards of the company — reliable, professional, polite, and
                  committed to excellent customer service across local,
                  corporate, airport, and specialist journeys.
                </p>

                <div className="mt-6">
                  <Button onClick={scrollToForm} className="font-semibold">
                    Start Your Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}