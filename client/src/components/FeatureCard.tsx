import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: string;
  text: string;
  icon?: LucideIcon;
};

export default function FeatureCard({ title, text, icon: Icon }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {Icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
