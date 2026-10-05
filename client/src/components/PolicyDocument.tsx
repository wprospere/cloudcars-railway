import { useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

function track(eventName: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") w.gtag("event", eventName, props);
}

type Section = { id: string; title: string; body: string };

function slugify(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `${slug}-${index}` : `section-${index}`;
}

// Splits CMS markdown on "## " headings; text before the first heading is the intro.
function splitSections(markdown: string): { intro: string; sections: Section[] } {
  const introLines: string[] = [];
  const sections: Section[] = [];
  let current: { title: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    sections.push({
      id: slugify(current.title, sections.length),
      title: current.title,
      body: current.lines.join("\n").trim(),
    });
    current = null;
  };

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*-{3,}\s*$/.test(line)) continue;

    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      flush();
      current = { title: heading[1], lines: [] };
      continue;
    }

    if (current) current.lines.push(line);
    else introLines.push(line);
  }
  flush();

  return { intro: introLines.join("\n").trim(), sections };
}

function makeComponents(location: string) {
  return {
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="mt-7 mb-3 border-l-2 border-primary/50 pl-3 text-lg font-semibold text-foreground first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4 className="mt-5 mb-2 text-base font-semibold text-foreground">{children}</h4>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mb-4 leading-7 text-muted-foreground last:mb-0">{children}</p>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="my-4 space-y-2.5 first:mt-0 last:mb-0">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="my-4 list-decimal space-y-2.5 pl-6 text-muted-foreground marker:font-semibold marker:text-primary">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="relative pl-6 leading-7 text-muted-foreground before:absolute before:left-1 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary [ol>&]:pl-1 [ol>&]:before:hidden">
        {children}
      </li>
    ),
    hr: () => null,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <div className="my-5 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="[&>p]:m-0">{children}</div>
      </div>
    ),
    table: ({ children }: { children?: ReactNode }) => (
      <div className="my-5 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th className="bg-secondary px-4 py-3 font-semibold text-foreground">{children}</th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="border-t border-border px-4 py-3 text-muted-foreground">{children}</td>
    ),
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      const isMail = (href ?? "").startsWith("mailto:");
      const isTel = (href ?? "").startsWith("tel:");
      const isExternal = !!href && (href.startsWith("http://") || href.startsWith("https://"));

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="break-words font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => {
            if (isMail) track("contact_click", { type: "email", location });
            else if (isTel) track("contact_click", { type: "phone", location });
            else if (isExternal)
              track("external_link_click", {
                location,
                label: String(children ?? "link"),
                href: href ?? "",
              });
          }}
        >
          {children}
        </a>
      );
    },
  };
}

export default function PolicyDocument({
  markdown,
  location,
  children,
}: {
  markdown: string;
  location: string;
  children?: ReactNode;
}) {
  const { intro, sections } = useMemo(() => splitSections(markdown), [markdown]);
  const components = useMemo(() => makeComponents(location), [location]);

  return (
    <div className="section-light bg-background py-10 lg:py-14">
      <div className="container">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          {sections.length > 2 ? (
            <aside className="hidden lg:block">
              <nav
                aria-label="On this page"
                className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  On this page
                </p>
                <ul className="space-y-0.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-3 py-2 text-sm leading-snug text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : (
            <div className="hidden lg:block" />
          )}

          <div className="min-w-0 space-y-6">
            {intro ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components as any}>
                  {intro}
                </ReactMarkdown>
              </div>
            ) : null}

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
              >
                <h2 className="mb-5 flex items-start gap-3 text-xl font-bold text-foreground md:text-2xl">
                  <span className="mt-1.5 h-6 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {section.title}
                </h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components as any}>
                  {section.body}
                </ReactMarkdown>
              </section>
            ))}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
