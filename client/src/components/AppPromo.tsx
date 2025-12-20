import { Smartphone, MapPin, Clock, Bell, Star } from "lucide-react";

const appFeatures = [
  {
    icon: MapPin,
    title: "Live Map Tracking",
    description: "See your driver arrive in real-time on the map",
  },
  {
    icon: Clock,
    title: "Book Now or Later",
    description: "Instant pickup or schedule for when you need it",
  },
  {
    icon: Bell,
    title: "Instant Updates",
    description: "Get notified when your driver's on the way",
  },
  {
    icon: Star,
    title: "Choose Your Ride",
    description: "Standard, Executive, or Xtra - pick what suits you",
  },
];

export default function AppPromo() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Phone with Real Screenshot */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-72 sm:w-80 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-2 shadow-2xl">
                {/* Screen with Real App Screenshot */}
                <div className="w-full rounded-[2.5rem] overflow-hidden relative">
                  <img 
                    src="/app-screenshot.jpg" 
                    alt="Cloud Cars App - Book your ride in Nottingham" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -right-4 top-20 bg-primary text-primary-foreground rounded-xl p-4 shadow-xl">
                <Smartphone className="w-6 h-6 mb-1" />
                <div className="text-xs font-semibold">Free<br/>Download</div>
              </div>

              {/* Feature Callout */}
              <div className="absolute -left-4 bottom-32 bg-card border border-border rounded-xl p-3 shadow-xl max-w-[160px]">
                <div className="text-xs font-semibold text-foreground">Real-time tracking</div>
                <div className="text-xs text-muted-foreground">Watch your driver arrive</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Download Our App
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Book Your Ride{" "}
              <span className="text-gradient-green font-['Playfair_Display',serif] italic">
                in Seconds
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Get the Cloud Cars app and you're just a few taps away from your next journey. 
              Choose from Standard, Executive, or Xtra vehicles - all with upfront fixed pricing 
              and real-time driver tracking across Nottingham.
            </p>

            {/* App Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://apps.apple.com/gb/app/cloudcars-ltd/id1412766278"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-6 py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-lg font-semibold -mt-1">App Store</div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.haulmont.taxi.mobile.client.cloudcars&utm_source=emea_Med"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-6 py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-80">Get it on</div>
                  <div className="text-lg font-semibold -mt-1">Google Play</div>
                </div>
              </a>
            </div>

            {/* Eco-friendly note */}
            <p className="text-sm text-muted-foreground mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Nottingham's eco-friendly taxi service
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
