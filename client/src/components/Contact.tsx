import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;

  const w = window as any;

  // ✅ Google Analytics 4 (gtag)
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, props);
  }
}

const contactInfo: Array<{
  icon: any;
  title: string;
  primary: ReactNode;
  secondary: string;
}> = [
  {
    icon: Phone,
    title: "Give Us a Ring",
    primary: (
      <a
        href="tel:+441158244244"
        onClick={() =>
          track("contact_click", { type: "phone", location: "contact_card" })
        }
        className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
      >
        0115 8 244 244
      </a>
    ),
    secondary: "Open 24/7",
  },
  {
    icon: Mail,
    title: "Drop Us an Email",
    primary: (
      <a
        href="mailto:bookings@cloudcarsltd.com?subject=Booking%20Enquiry%20-%20Cloud%20Cars"
        onClick={() =>
          track("contact_click", { type: "email", location: "contact_card" })
        }
        className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
      >
        bookings@cloudcarsltd.com
      </a>
    ),
    secondary: "We'll reply within a day",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
    // Honeypot: a real user never fills this (it is visually hidden).
    company_website: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Cloudflare Turnstile token + widget management
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const contactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
      track("contact_form_submitted", { location: "contact_form" });
      // Token is single-use; reset the widget.
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
      track("contact_form_error", { location: "contact_form" });
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
          callback: (token: string) => setTurnstileToken(token),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMutation.isPending) return;

    if (!turnstileToken) {
      toast.error("Please complete the verification before submitting.");
      return;
    }

    contactMutation.mutate({ ...formData, turnstileToken });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Contact Info */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Talk to{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                Cloud Cars
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Got a question, need a quote, or want to discuss a regular booking? The quickest way to reach us is always by phone.
            </p>

            <a
              href="tel:+441158244244"
              onClick={() => track("contact_click", { type: "phone", location: "contact_hero" })}
              className="flex items-center gap-4 mb-10 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Available 24/7</p>
                <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">0115 8 244 244</p>
              </div>
            </a>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-5 border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-foreground">{item.primary}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.secondary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border h-fit">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Message Sent
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Thanks for getting in touch. We&apos;ll get back to you as soon
                  as we can.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Send Us a Message
                </h3>
                <p className="text-muted-foreground mb-6">
                  Fill in the form and we&apos;ll get back to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="bg-background"
                      />
                    </div>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0115 123 4567"
                      className="bg-background"
                    />
                  </div>
                  <div className="hidden">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us what you need..."
                      rows={5}
                      className="bg-background resize-none"
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
                      value={formData.company_website}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Cloudflare Turnstile widget */}
                  <div ref={turnstileRef} className="flex justify-center" />

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending || !turnstileToken}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
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
