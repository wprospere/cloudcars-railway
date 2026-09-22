import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Users,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building2,
  User,
  Mail,
  Phone,
  FileBadge,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// Cloudflare Turnstile site key (public — safe to expose in the client).
// The matching SECRET key lives only on the server.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const benefits = [
  {
    icon: Smartphone,
    title: "Work Through Our Platform",
    description:
      "Once approved, your drivers get access to the same booking app our own drivers use — no separate system to learn.",
  },
  {
    icon: Users,
    title: "Keep Your Own Business",
    description:
      "Stay independent. Cloud Cars is somewhere your fleet picks up extra work, not a replacement for your existing operation.",
  },
  {
    icon: Car,
    title: "1 to 5+ Vehicles",
    description:
      "Whether you're a single driver working with more than one firm, or run a small fleet, there's a place for you here.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-First",
    description:
      "We're selective about who joins — all papers in order and vehicles kept in good condition.",
  },
];

const partnerSchema = z.object({
  companyName: z.string().min(2, "Please enter your company or trading name"),
  contactName: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  fleetSize: z.enum(["1", "2-3", "4-5", "5+"]),
  operatorLicenceNumber: z.string().optional(),
  operatorLicenceAuthority: z.string().optional(),
  message: z.string().optional(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

const defaultValues: PartnerFormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  fleetSize: "1",
  operatorLicenceNumber: "",
  operatorLicenceAuthority: "",
  message: "",
};

export default function PartnerWithCloudCars() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Honeypot: a real user never fills this (it is visually hidden).
  const [honeypot, setHoneypot] = useState("");

  // Cloudflare Turnstile token + widget management
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema) as any,
    defaultValues,
  });

  const submitApplication = trpc.fleetPartner.submitApplication.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset(defaultValues);
      setHoneypot("");
      // Token is single-use; reset the widget for any future submission.
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: () => {
      // Token is single-use; reset the widget so the user can retry.
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    },
  });

  useEffect(() => {
    // Load the Turnstile script once.
    const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`
    );

    const renderWidget = () => {
      if (
        window.turnstile &&
        turnstileRef.current &&
        widgetIdRef.current === null
      ) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError("");
          },
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    } else {
      script.addEventListener("load", renderWidget);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const onSubmit: SubmitHandler<PartnerFormValues> = (values) => {
    if (!turnstileToken) {
      setTurnstileError("Please complete the verification before submitting.");
      return;
    }

    submitApplication.mutate({
      companyName: values.companyName,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      fleetSize: values.fleetSize,
      operatorLicenceNumber: values.operatorLicenceNumber,
      operatorLicenceAuthority: values.operatorLicenceAuthority,
      message: values.message,
      turnstileToken, // ✅ verified server-side
      company_website: honeypot, // ✅ honeypot (empty for real users)
    });
  };

  const scrollToForm = () => {
    document
      .getElementById("partner-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Header />

      <main className="pt-16 lg:pt-20">
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-secondary/40 py-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="container relative">
            <div className="mb-8">
              <a
                href="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Return to Cloud Cars
              </a>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Partner Program
                </span>

                <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Partner with{" "}
                  <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                    Cloud Cars
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground lg:text-xl">
                  Own your own executive car or run a small private hire fleet
                  in Nottingham? Partner with Cloud Cars to pick up extra work
                  through our platform — alongside whoever else you already
                  drive for.
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Whether you're a single driver working with more than one
                  firm, or a small operator with a handful of vehicles looking
                  for more work, we're looking for partners with all their
                  papers in order and cars kept in good condition.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={scrollToForm}
                    className="bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Apply to Partner
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

                <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    We're selective about who joins
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Cloud Cars only partners with fully licensed, insured
                    drivers and operators with vehicles in good condition. If
                    that's you, we'd like to hear from you.
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
                        Thank you for your interest in partnering with Cloud
                        Cars. A member of our team will review your
                        application and be in touch.
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
                          Apply to Partner
                        </h3>

                        <p className="mt-3 leading-7 text-muted-foreground">
                          Tell us about yourself or your fleet, and we'll be in
                          touch about next steps.
                        </p>
                      </div>

                      <form
                        id="partner-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5 scroll-mt-24"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="companyName">
                            Company / trading name
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="companyName"
                              {...form.register("companyName")}
                              className="pl-10"
                              placeholder="e.g. your own name if you drive solo"
                            />
                          </div>
                          {form.formState.errors.companyName && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.companyName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact name</Label>
                          <div className="relative">
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="contactName"
                              {...form.register("contactName")}
                              className="pl-10"
                              placeholder="Full name"
                            />
                          </div>
                          {form.formState.errors.contactName && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.contactName.message}
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

                        <div className="space-y-2">
                          <Label>How many vehicles?</Label>
                          <Select
                            value={form.watch("fleetSize")}
                            onValueChange={(value) =>
                              form.setValue(
                                "fleetSize",
                                value as PartnerFormValues["fleetSize"],
                                { shouldValidate: true }
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fleet size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                Just me (1 vehicle)
                              </SelectItem>
                              <SelectItem value="2-3">
                                2-3 vehicles
                              </SelectItem>
                              <SelectItem value="4-5">
                                4-5 vehicles
                              </SelectItem>
                              <SelectItem value="5+">5+ vehicles</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="operatorLicenceNumber">
                              Operator licence number
                            </Label>
                            <div className="relative">
                              <FileBadge className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="operatorLicenceNumber"
                                {...form.register("operatorLicenceNumber")}
                                className="pl-10"
                                placeholder="If you have one"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="operatorLicenceAuthority">
                              Licensing authority
                            </Label>
                            <Input
                              id="operatorLicenceAuthority"
                              {...form.register("operatorLicenceAuthority")}
                              placeholder="e.g. Nottingham City Council"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Tell us about your fleet</Label>
                          <Textarea
                            id="message"
                            {...form.register("message")}
                            placeholder="Vehicle types, current work, availability, or anything else relevant."
                            className="min-h-[120px]"
                          />
                        </div>

                        {/* Honeypot — hidden from real users, attractive to bots.
                            aria-hidden + tabIndex -1 keep it away from screen readers and keyboard. */}
                        <div
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: "-9999px",
                            width: "1px",
                            height: "1px",
                            overflow: "hidden",
                          }}
                        >
                          <label htmlFor="company_website">
                            Company website (leave blank)
                          </label>
                          <input
                            id="company_website"
                            name="company_website"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                          />
                        </div>

                        {/* Cloudflare Turnstile widget */}
                        <div ref={turnstileRef} className="flex justify-center" />

                        {turnstileError && (
                          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                            <p className="text-sm text-destructive">
                              {turnstileError}
                            </p>
                          </div>
                        )}

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
                            disabled={
                              submitApplication.isPending || !turnstileToken
                            }
                            className="w-full bg-primary py-6 font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            {submitApplication.isPending ? (
                              <span className="inline-flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting Application...
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center">
                                Apply to Partner
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
                            We review applications within 24–48 hours. If
                            you're a good fit, we'll be in touch to discuss
                            your papers, vehicles, and getting set up on our
                            platform.
                          </p>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-light border-t border-border/50 bg-background py-16 lg:py-20">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

            <div className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                What we look for
              </h3>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Valid private hire operator/driver licence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Up-to-date insurance and MOT
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Vehicles kept clean and in good condition
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Reliable, professional and well-presented
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
