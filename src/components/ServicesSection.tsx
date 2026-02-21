import { Home, PlusSquare, Wrench, Paintbrush, Building, Layers } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    description: "Custom-built homes and full residential construction services tailored to Albuquerque families. We bring your dream home to life with quality craftsmanship.",
  },
  {
    icon: PlusSquare,
    title: "Home Additions",
    description: "Need more space? Our home addition services expand your living area seamlessly — from extra bedrooms to sunrooms and second-story additions.",
  },
  {
    icon: Layers,
    title: "Roofing",
    description: "Protect your home with professional roofing services. New installations, repairs, and complete replacements built to withstand New Mexico's climate.",
  },
  {
    icon: Wrench,
    title: "Repairs & Renovations",
    description: "From structural repairs to full renovations, we restore and upgrade your property with precision. No job is too big or too small for our experienced team.",
  },
  {
    icon: Paintbrush,
    title: "Interior Remodels",
    description: "Transform kitchens, bathrooms, and living spaces with modern interior remodels. Elevate your home's comfort, style, and market value.",
  },
  {
    icon: Building,
    title: "Light Commercial",
    description: "Reliable light commercial construction including tenant improvements, partition walls, and structural upgrades for small business owners in Albuquerque.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Our Construction Services
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            As Albuquerque's trusted general contractor, On Time Construction delivers expert services for homeowners and commercial property owners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-card rounded-xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 group border border-border hover:border-secondary/30"
            >
              <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <service.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-card-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
