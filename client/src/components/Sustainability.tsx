import { Leaf, Car, TreePine, Zap } from "lucide-react";

const sustainabilityFeatures = [
  {
    icon: Car,
    title: "100% Hybrid Fleet",
    description: "Every vehicle in our fleet is a hybrid, combining efficiency with reliability for cleaner journeys across Nottingham.",
  },
  {
    icon: Leaf,
    title: "Lower Emissions",
    description: "Our hybrid vehicles produce significantly fewer emissions than traditional taxis, helping keep Nottingham's air cleaner.",
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
    <section id="sustainability" className="py-20 lg:py-28 bg-gradient-to-b from-background to-card relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Driving Greener</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sustainable Travel,{" "}
            <span className="text-primary">One Mile at a Time</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cloud Cars is proud to operate a 100% hybrid fleet. We're committed to reducing 
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
                  <div className="text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Hybrid Fleet</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50">
                  <div className="text-3xl font-bold text-primary mb-1">30%</div>
                  <div className="text-sm text-muted-foreground">Less CO₂</div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                By choosing Cloud Cars, you're not just getting a reliable taxi service – 
                you're making a conscious choice for the environment. Our hybrid vehicles 
                produce up to 30% less CO₂ than conventional taxis.
              </p>
            </div>

            {/* Quote */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <blockquote className="text-lg text-foreground italic mb-4">
                "We believe that providing excellent taxi services and caring for our 
                environment go hand in hand. Every journey with Cloud Cars is a step 
                towards a greener Nottingham."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">CC</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">Cloud Cars Team</div>
                  <div className="text-sm text-muted-foreground">Nottingham, UK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
