import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#corporate", label: "Corporate" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="/"
            className="flex items-center gap-2 group"
            onClick={closeMobileMenu}
            aria-label="Cloud Cars home"
          >
            <img
              src="/logo.png"
              alt="Cloud Cars"
              className="h-12 lg:h-14 w-auto"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:01158244244"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Call Cloud Cars on 0115 8 244 244"
            >
              <Phone className="w-4 h-4" />
              <span>0115 8 244 244</span>
            </a>

            <Button
              asChild
              variant="outline"
              className="font-semibold px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <a href="/#drivers">Become a Driver</a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="font-semibold px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/account/auth/CORPORATE"
                target="_blank"
                rel="noopener noreferrer"
              >
                Corporate Login
              </a>
            </Button>

            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden glass border-t border-border/50"
        >
          <nav
            className="container mx-auto py-4 flex flex-col gap-2"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="py-3 px-4 text-left text-foreground hover:bg-secondary/50 rounded-lg transition-colors block"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 mt-2 border-t border-border/50 flex flex-col gap-3">
              <a
                href="tel:01158244244"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 py-3 px-4 text-muted-foreground"
                aria-label="Call Cloud Cars on 0115 8 244 244"
              >
                <Phone className="w-4 h-4" />
                <span>0115 8 244 244</span>
              </a>

              <Button
  asChild
  className="font-semibold px-6 bg-green-500/15 text-green-600 border border-green-500/30 hover:bg-green-500 hover:text-white transition-colors"
>
  <a href="/#drivers">Become a Driver</a>
</Button>

              <Button
                asChild
                variant="outline"
                className="w-full font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <a
                  href="https://book.cloudcarsltd.com/portal/#/account/auth/CORPORATE"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                >
                  Corporate Login
                </a>
              </Button>

              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <a
                  href="https://book.cloudcarsltd.com/portal/#/booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                >
                  Book Now
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}