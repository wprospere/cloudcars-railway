import { Star } from "lucide-react";

export default function RatingBar() {
  return (
    <section className="bg-secondary/30 border-y border-border">
      <div className="container mx-auto max-w-7xl py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>

          <p className="text-sm font-medium text-foreground">
            Rated <span className="font-semibold">4.9/5</span> by hundreds of
            customers across Nottingham
          </p>

          <a
            href="https://www.google.com/search?q=cloud+cars+nottingham"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View reviews →
          </a>
        </div>
      </div>
    </section>
  );
}