import { Leaf, Car, TreePine, Zap } from "lucide-react";

const sustainabilityFeatures = [
  {
    icon: Car,
    title: "Hybrid-Led Fleet",
    description: "Most of our cars are hybrids, combining efficiency with reliability for cleaner journeys across Nottingham.",
  },
  {
    icon: Leaf,
    title: "Lower Emissions",
    description: "Our hybrid cars produce fewer emissions than traditional taxis, helping keep Nottingham's air cleaner.",
  },
  {
    icon: Zap,
    title: "Fuel Efficient",
    description: "Hybrid technology means better fuel economy, which we pass on through competitive fixed prices for our customers.",
  },
  {
    icon: TreePine,
    title: "Carbon Conscious",
    description: "We're committed to reducing our carbon footprint one mile at a time, making every journey a greener choice.",
  },
];

export default function Sustainability() {
  return (
    <section
      id="sustainability"
      className="section-light bg-background py-20 lg:py-28"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Driving Greener</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sustainable Travel,{" "}
            <span className="text-gradient-green font-['Playfair_Display',serif] italic">One Mile at a Time</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cloud Cars is proud to run a hybrid-led fleet. We're committed to reducing 
            our environmental impact while providing reliable, comfortable transport across Nottingham.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {sustainabilityFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right - Stats & Message */}
          <div className="space-y-8">
            {/* Eco Stats */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Eco-Friendly Choice</h3>
                  <p className="text-muted-foreground">For Nottingham & Beyond</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 rounded-xl bg-background/50">
                  <div className="text-3xl font-bold text-primary mb-1">Hybrid-Led</div>
                  <div className="text-sm text-muted-foreground">Fleet</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50">
                  <div className="text-3xl font-bold text-primary mb-1">Lower</div>
                  <div className="text-sm text-muted-foreground">Emissions</div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                By choosing Cloud Cars, you're not just getting a reliable taxi service – 
                you're making a conscious choice for the environment. Our hybrid cars 
                produce lower emissions than conventional taxis.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-base font-semibold text-foreground mb-3">An eco-conscious Nottingham taxi firm</h3>
              <p className="text-sm text-muted-foreground leading-6">
                We run a hybrid-led fleet because it is the right thing to do for Nottingham. Choosing a hybrid car means lower emissions on every journey than a conventional taxi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
