import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#corporate", label: "Corporate" },
  { href: "#drivers", label: "Drive With Us" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Cloud Cars"
              className="h-12 lg:h-14 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:01158244244"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>0115 8 244 244</span>
            </a>

            {/* Corporate Login */}
            <Button
              asChild
              variant="outline"
              className="font-semibold px-6 border-primary text-primary
                         hover:bg-primary hover:text-primary-foreground
                         transition-colors"
            >
              <a
                href="https://book.cloudcarsltd.com/portal/#/account/auth/CORPORATE"
                target="_blank"
                rel="noopener noreferrer"
              >
                Corporate Login
              </a>
            </Button>

            {/* Book Now */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-border/50">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="py-3 px-4 text-left text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-border/50 flex flex-col gap-3">
              <a
                href="tel:01158244244"
                className="flex items-center gap-2 py-3 px-4 text-muted-foreground"
              >
                <Phone className="w-4 h-4" />
                <span>0115 8 244 244</span>
              </a>

              {/* Corporate Login */}
              <Button
                asChild
                variant="outline"
                className="w-full font-semibold border-primary text-primary
                           hover:bg-primary hover:text-primary-foreground
                           transition-colors"
              >
                <a
                  href="https://book.cloudcarsltd.com/portal/#/account/auth/CORPORATE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Corporate Login
                </a>
              </Button>

              {/* Book Now */}
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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
          </nav>
        </div>
      )}
    </header>
  );
}
