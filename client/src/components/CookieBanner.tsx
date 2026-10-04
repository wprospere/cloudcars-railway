import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cc_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "cloudcars:open-cookie-settings";

function readChoice(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveChoice(value: "accepted" | "declined") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage blocked — the choice just won't persist
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readChoice()) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const accept = () => {
    saveChoice("accepted");
    (window as any).cloudcarsEnableAnalytics?.();
    setVisible(false);
  };

  const decline = () => {
    const hadAccepted = readChoice() === "accepted";
    saveChoice("declined");
    setVisible(false);
    // Analytics cookies already set can't be unloaded mid-session; reload so they stop.
    if (hadAccepted) window.location.reload();
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <p className="text-sm text-foreground font-semibold mb-1">
          Cookies on cloudcarsltd.com
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          We use Google Analytics cookies to understand how people use our site
          and improve it. They&apos;re optional and only switched on if you accept.
          See our{" "}
          <Link href="/cookies" className="text-primary hover:underline">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={accept} className="font-semibold">
            Accept analytics cookies
          </Button>
          <Button onClick={decline} variant="outline" className="font-semibold">
            No thanks
          </Button>
        </div>
      </div>
    </div>
  );
}
