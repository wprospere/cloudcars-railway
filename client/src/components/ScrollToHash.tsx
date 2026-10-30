import { useEffect } from "react";
import { useLocation } from "wouter";

// The home page lazy-loads its sections, so the page keeps growing for a
// moment after it mounts. Scrolling once would land short of the target, so
// keep re-aligning until the target stops moving (or the visitor scrolls).
const CHECK_EVERY_MS = 150;
const GIVE_UP_AFTER_MS = 5000;
const STABLE_CHECKS = 4;

export default function ScrollToHash() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.replace("#", ""));
    const startedAt = Date.now();
    let lastTop: number | null = null;
    let stableChecks = 0;
    let timer: number | undefined;

    const stop = () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };

    const check = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        const top = el.getBoundingClientRect().top + window.scrollY;
        stableChecks = lastTop !== null && Math.abs(top - lastTop) < 2 ? stableChecks + 1 : 0;
        lastTop = top;
        if (stableChecks >= STABLE_CHECKS) return stop();
      }
      if (Date.now() - startedAt > GIVE_UP_AFTER_MS) return stop();
      timer = window.setTimeout(check, CHECK_EVERY_MS);
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    timer = window.setTimeout(check, 200);

    return stop;
  }, [location]);

  return null;
}
