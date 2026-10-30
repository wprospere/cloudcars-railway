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
      className="fixed inset-x-0 bottom-0 z-[100] p-2 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-3 sm:p-5 shadow-2xl">
        <p className="text-sm text-foreground font-semibold mb-0.5 sm:mb-1">
          Cookies on cloudcarsltd.com
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-snug sm:leading-relaxed mb-2 sm:mb-4">
          <span className="hidden sm:inline">
            We use Google Analytics cookies to understand how people use our
            site and improve it. They&apos;re optional and only switched on if
            you accept. See our{" "}
          </span>
          <span className="sm:hidden">
            Optional analytics cookies, only switched on if you accept. See our{" "}
          </span>
          <Link href="/cookies" className="text-primary hover:underline">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex flex-row gap-2 sm:gap-3">
          <Button onClick={accept} className="font-semibold flex-1 sm:flex-none h-9 sm:h-10 px-3 text-xs sm:text-sm">
            Accept analytics cookies
          </Button>
          <Button onClick={decline} variant="outline" className="font-semibold flex-1 sm:flex-none h-9 sm:h-10 px-3 text-xs sm:text-sm">
            No thanks
          </Button>
        </div>
      </div>
    </div>
  );
}
