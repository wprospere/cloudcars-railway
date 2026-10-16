import { ShieldCheck, Star } from "lucide-react";
import { GOOGLE_REVIEWS_URL } from "@/const";

export default function RatingBar() {
  return (
    <section className="bg-secondary/30 border-y border-border">
      <div className="container mx-auto max-w-7xl py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <ShieldCheck className="w-5 h-5 text-primary" />

          <p className="text-sm font-medium text-foreground">
            Licensed by Nottingham City and Rushcliffe councils, with
            DBS-checked drivers, serving Nottingham since 2012
          </p>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Star className="w-4 h-4" />
            Review us on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
