import { ShieldCheck, Clock, Building2, Plane } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Licensed Operator",
      desc: "Fully licensed Nottingham taxi service",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      desc: "Airport transfers anytime",
    },
    {
      icon: Building2,
      title: "Corporate Accounts",
      desc: "Trusted by Nottingham businesses",
    },
    {
      icon: Plane,
      title: "Airport Specialists",
      desc: "East Midlands, Heathrow & more",
    },
  ];

  return (
    <section className="border-y border-border bg-background/70 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}