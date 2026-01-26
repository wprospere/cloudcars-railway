import {
  ArrowLeft,
  Cookie,
  Shield,
  Settings,
  BarChart3,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;

  // ✅ Google Analytics 4 (gtag)
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, props);
  }
}

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => track("nav_click", { location: "cookies_header", to: "home_logo" })}
          >
            <img src="/logo.png" alt="Cloud Cars" className="h-10 w-auto" />
          </Link>

          <Link
            href="/"
            onClick={() => track("nav_click", { location: "cookies_header", to: "home_button" })}
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium text-primary">
              Cookie Policy
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            This policy explains how Cloud Cars Ltd uses cookies and similar
            technologies on our website and mobile applications.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {/* What Are Cookies */}
          <div className="mb-12 p-8 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                What Are Cookies?
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Cookies are small text files that are placed on your computer,
                smartphone, or other device when you visit a website. They are
                widely used to make websites work more efficiently, provide
                information to website owners, and enhance your browsing
                experience.
              </p>
              <p>
                Cookies allow websites to recognise your device and remember
                certain information about your visit, such as your preferences,
                login details, and browsing history.
              </p>
            </div>
          </div>

          {/* How We Use Cookies */}
          <div className="mb-12 p-8 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                How We Use Cookies
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Cloud Cars Ltd uses cookies for several purposes on our website
                (www.cloudcarsltd.com) and mobile applications:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">
                    Essential Cookies:
                  </strong>{" "}
                  These are necessary for the website to function properly. They
                  enable core functionality such as security, network
                  management, and account access.
                </li>
                <li>
                  <strong className="text-foreground">
                    Functional Cookies:
                  </strong>{" "}
                  These help us remember your preferences and settings, such as
                  your language preference or login details, to provide a more
                  personalised experience.
                </li>
                <li>
                  <strong className="text-foreground">
                    Analytics Cookies:
                  </strong>{" "}
                  We use these to understand how visitors interact with our
                  website, helping us improve our services and user experience.
                </li>
                <li>
                  <strong className="text-foreground">
                    Performance Cookies:
                  </strong>{" "}
                  These collect information about how you use our website, such
                  as which pages you visit most often, helping us optimise site
                  performance.
                </li>
              </ul>
            </div>
          </div>

          {/* Types of Cookies We Use */}
          <div className="mb-12 p-8 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Types of Cookies We Use
              </h2>
            </div>

            <div className="space-y-6">
              {/* Essential */}
              <div className="p-4 rounded-xl bg-background border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Essential Cookies
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Required for the website to function. Cannot be disabled.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-foreground">
                          Cookie Name
                        </th>
                        <th className="text-left py-2 text-foreground">
                          Purpose
                        </th>
                        <th className="text-left py-2 text-foreground">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2">session_id</td>
                        <td className="py-2">
                          Maintains your session while browsing
                        </td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2">csrf_token</td>
                        <td className="py-2">
                          Security - prevents cross-site request forgery
                        </td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2">cookie_consent</td>
                        <td className="py-2">Stores your cookie preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-xl bg-background border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Help us understand how visitors use our website.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-foreground">
                          Cookie Name
                        </th>
                        <th className="text-left py-2 text-foreground">
                          Purpose
                        </th>
                        <th className="text-left py-2 text-foreground">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2">_ga</td>
                        <td className="py-2">
                          Google Analytics - distinguishes users
                        </td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2">_ga_*</td>
                        <td className="py-2">
                          Google Analytics - maintains session state
                        </td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2">_gid</td>
                        <td className="py-2">
                          Google Analytics - distinguishes users
                        </td>
                        <td className="py-2">24 hours
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Functional */}
              <div className="p-4 rounded-xl bg-background border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Functional Cookies
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Remember your preferences for a better experience.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-foreground">
                          Cookie Name
                        </th>
                        <th className="text-left py-2 text-foreground">
                          Purpose
                        </th>
                        <th className="text-left py-2 text-foreground">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2">user_preferences</td>
                        <td className="py-2">Stores your site preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2">recent_bookings</td>
                        <td className="py-2">
                          Remembers recent pickup locations
                        </td>
                        <td className="py-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Third Party Cookies */}
          <div className="mb-12 p-8 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Third-Party Cookies
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Some cookies on our website are set by third-party services that
                appear on our pages. We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Google Analytics:</strong>{" "}
                  Helps us understand website traffic and user behaviour.{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={() =>
                      track("external_link_click", {
                        location: "cookies_third_party",
                        label: "Google Privacy Policy (Analytics)",
                        href: "https://policies.google.com/privacy",
                      })
                    }
                  >
                    Google Privacy Policy
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Google Maps:</strong>{" "}
                  Powers our location services and mapping features.{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={() =>
                      track("external_link_click", {
                        location: "cookies_third_party",
                        label: "Google Privacy Policy (Maps)",
                        href: "https://policies.google.com/privacy",
                      })
                    }
                  >
                    Google Privacy Policy
                  </a>
                </li>
              </ul>
              <p>
                We do not control these third-party cookies. Please refer to the
                respective privacy policies for more information about their
                cookie practices.
              </p>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="mb-12 p-8 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Managing Your Cookie Preferences
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                You have the right to decide whether to accept or reject
                cookies. You can manage your cookie preferences in several ways:
              </p>

              <h3 className="font-semibold text-foreground mt-6">
                Browser Settings
              </h3>
              <p>
                Most web browsers allow you to control cookies through their
                settings. You can usually find these settings in the "Options"
                or "Preferences" menu of your browser. The following links
                provide information on how to modify cookie settings in popular
                browsers:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={() =>
                      track("external_link_click", {
                        location: "cookies_browser_settings",
                        label: "Google Chrome",
                        href: "https://support.google.com/chrome/answer/95647",
                      })
                    }
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={() =>
                      track("external_link_click", {
                        location: "cookies_browser_settings",
                        label: "Mozilla Firefox",
                        href: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer",
                      })
                    }
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={() =>
                      track("external_link_click", {
                        location: "cookies_browser_settings",
                        label: "Safari",
                        href: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac",
                      })
                    }
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={() =>
                      track("external_link_click", {
                        location: "cookies_browser_settings",
                        label: "Microsoft Edge",
                        href: "https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d",
                      })
                    }
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <h3 className="font-semibold text-foreground mt-6">
                Opt-Out of Analytics
              </h3>
              <p>
                To opt out of Google Analytics tracking across all websites, you
                can install the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  onClick={() =>
                    track("external_link_click", {
                      location: "cookies_opt_out",
                      label: "GA Opt-out Add-on",
                      href: "https://tools.google.com/dlpage/gaoptout",
                    })
                  }
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>

              <h3 className="font-semibold text-foreground mt-6">
                Impact of Disabling Cookies
              </h3>
              <p>
                Please note that if you choose to disable cookies, some features
                of our website may not function properly. Essential cookies
                cannot be disabled as they are necessary for the website to
                operate.
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="mb-12 p-8 rounded-2xl bg-card border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Updates to This Policy
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We encourage you to review this policy
                periodically for any updates.
              </p>
              <p>
                Any changes will be posted on this page with an updated "Last
                updated" date.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Questions?
            </h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:info@cloudcarsltd.com"
                  className="text-primary hover:underline"
                  onClick={() =>
                    track("contact_click", {
                      type: "email",
                      location: "cookies_page",
                    })
                  }
                >
                  info@cloudcarsltd.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong>{" "}
                <a
                  href="tel:+441158244244"
                  className="text-primary hover:underline"
                  onClick={() =>
                    track("contact_click", {
                      type: "phone",
                      location: "cookies_page",
                    })
                  }
                >
                  0115 8 244 244
                </a>
              </p>
              <p>
                <strong className="text-foreground">Address:</strong> Unit 5
                Medway Street, Nottingham, NG8 1PN
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              onClick={() => track("nav_click", { location: "cookies_footer", to: "home_button" })}
            >
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
