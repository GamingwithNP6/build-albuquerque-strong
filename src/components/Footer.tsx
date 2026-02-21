import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-heading font-bold text-xl text-background">
              ON TIME<span className="text-secondary"> CONSTRUCTION</span>
            </span>
            <p className="text-background/50 mt-3 text-sm leading-relaxed">
              Licensed general contractor serving Albuquerque and surrounding communities for over 25 years. Quality construction, on time, every time.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Services</h4>
            <ul className="space-y-2 text-background/50 text-sm">
              <li>Residential Construction</li>
              <li>Home Additions</li>
              <li>Roofing</li>
              <li>Interior Remodels</li>
              <li>Light Commercial</li>
              <li>Repairs & Renovations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3 text-background/50 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <a href="tel:5059801923" className="hover:text-secondary transition-colors">(505) 980-1923</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Albuquerque, New Mexico
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-background/30 text-xs">
          <p>© {new Date().getFullYear()} On Time Construction LLC. All rights reserved. NM Contractor License #385205.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
