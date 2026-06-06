import { Leaf, Zap, TreePine } from "lucide-react";

const items = [
  { icon: Leaf, stat: "100% Hybrid", label: "Every vehicle in our fleet" },
  { icon: Zap, stat: "30% Less CO₂", label: "vs. conventional taxis" },
  { icon: TreePine, stat: "Carbon Conscious", label: "Greener Nottingham" },
];

export default function EcoStrip() {
  return (
    <div className="border-y border-primary/20 bg-gradient-to-r from-primary/[0.05] via-primary/[0.09] to-primary/[0.05]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-primary/15">
          {items.map(({ icon: Icon, stat, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-4 justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm leading-none mb-0.5">
                  {stat}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
