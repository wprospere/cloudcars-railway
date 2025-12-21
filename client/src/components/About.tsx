import { MapPin, Award, Heart, Users } from "lucide-react";
import { useCmsContent, useCmsImage } from "@/hooks/useCmsContent";

export default function About() {
  const content = useCmsContent("about");
  const aboutImage = useCmsImage(
    "about-image",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop"
  );

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
                    alt="Nottingham city skyline"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="/nottingham-council-house.jpg"
                    alt="Nottingham Council House and Old Market Square"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="/uk-motorway.jpg"
                    alt="UK M1 motorway"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
                    alt="Business handshake"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 lg:right-8 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
              <div className="text-4xl font-bold mb-1">12+</div>
              <div className="text-sm opacity-90">Years in<br />Nottingham</div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {content.title}{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                {content.subtitle}
              </span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>{content.description}</p>
              <p>
                Twelve years on, we're still here and still doing things the 
                same way. Our drivers live in Nottingham, know the streets, and 
                take pride in getting you where you need to be. No apps that 
                don't work, no call centres abroad - just a local company doing 
                a proper job.
              </p>
              <p>
                Whether it's a quick run to the station, getting the kids to 
                school, or regular airport trips for your business, we've got 
                you covered.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Local Knowledge
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We know Nottingham inside out. Every shortcut, every back road.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Done Right
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clean cars, polite drivers, fair prices. The basics, done well.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    You Come First
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your journey matters to us. We'll get you there safely.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Part of Nottingham
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We live here, work here, and support local businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
