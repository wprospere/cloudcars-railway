import { useEffect } from "react";

// index.html ships a generic title and description (for crawlers and link previews
// that don't run scripts). Once a page supplies its own, drop the generic one so the
// page never has two; if a page supplies none, put the generic one back.
export default function HeadDedupe() {
  useEffect(() => {
    const saved = Array.from(
      document.head.querySelectorAll("[data-static-meta]")
    ).map((el) => el.cloneNode(true) as HTMLElement);

    const settle = (selector: string, tagName: string) => {
      const nodes = Array.from(document.head.querySelectorAll(selector));
      const generic = nodes.filter((n) => n.hasAttribute("data-static-meta"));
      const own = nodes.filter((n) => !n.hasAttribute("data-static-meta"));

      if (own.length) {
        generic.forEach((n) => n.remove());
      } else if (!generic.length) {
        const original = saved.find((n) => n.tagName.toLowerCase() === tagName);
        if (original) document.head.appendChild(original.cloneNode(true));
      }
    };

    const sync = () => {
      settle("title", "title");
      settle('meta[name="description"]', "meta");
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
