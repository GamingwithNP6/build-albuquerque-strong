import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why-us" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a href="#" className="font-heading font-bold text-xl md:text-2xl text-primary-foreground tracking-tight">
          ON TIME<span className="text-secondary"> CONSTRUCTION</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium tracking-wide uppercase"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:5059801923"
            className="flex items-center gap-2 bg-secondary text-secondary-foreground font-heading font-semibold px-5 py-2.5 rounded-md hover:brightness-110 transition-all shadow-cta text-sm"
          >
            <Phone className="w-4 h-4" />
            (505) 980-1923
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-primary-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:5059801923"
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-heading font-semibold px-5 py-2.5 rounded-md text-sm"
            >
              <Phone className="w-4 h-4" />
              (505) 980-1923
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
