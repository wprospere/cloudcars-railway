// client/src/components/TrackedLink.tsx
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  eventName?: string; // default: "contact_click"
  props?: Record<string, any>;
  className?: string;
  children: ReactNode;
};

export default function TrackedLink({
  href,
  eventName = "contact_click",
  props = {},
  className,
  children,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(eventName, props)}
    >
      {children}
    </a>
  );
}
