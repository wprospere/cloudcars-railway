import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
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
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Got a question? Need to book? Just want to say hello? 
              We're here and happy to help however we can.
            </p>

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
                  <h4 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h4>
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
                  Thanks for getting in touch. We'll get back to you 
                  as soon as we can.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Send Us a Message
                </h3>
                <p className="text-muted-foreground mb-6">
                  Fill in the form and we'll get back to you.
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

                  <div className="grid sm:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
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

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
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
