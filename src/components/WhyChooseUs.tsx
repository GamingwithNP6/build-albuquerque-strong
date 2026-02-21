import { CheckCircle, Phone } from "lucide-react";

const reasons = [
  "25+ years of proven construction experience in Albuquerque",
  "Licensed New Mexico contractor (License #385205, active through 2027)",
  "Family-owned and locally operated — we know this community",
  "On-time project completion — it's in our name",
  "Strong permit history with the City of Albuquerque",
  "Both residential and commercial expertise under one roof",
  "Professional workmanship backed by decades of trust",
  "Transparent communication from start to finish",
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-widest">Why On Time</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mt-3 mb-6">
              Why Albuquerque Homeowners Choose Us
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
              When it comes to finding a reliable general contractor in Albuquerque, NM, experience matters. Owner Johnny Barela and the On Time Construction team bring over two decades of dedication to every project.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/80 text-sm leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8 md:p-10">
            <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Get a free, no-obligation estimate from Albuquerque's most trusted construction company. We'll discuss your vision, budget, and timeline — then deliver results on time.
            </p>
            <a
              href="tel:5059801923"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-heading font-bold px-8 py-4 rounded-md hover:brightness-110 transition-all shadow-cta text-lg"
            >
              <Phone className="w-5 h-5" />
              Call Now for a Quote
            </a>
            <p className="text-primary-foreground/40 text-sm mt-4">
              Or <a href="#contact-form" className="text-secondary hover:underline">fill out our form</a> for a quick response.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
