import { Shield, Clock, MapPin, Building2, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "Licensed NM Contractor", sub: "License #385205" },
  { icon: Clock, label: "25+ Years Experience", sub: "Established ~2000" },
  { icon: MapPin, label: "Locally Owned", sub: "Albuquerque, NM" },
  { icon: Building2, label: "Residential & Commercial", sub: "Full-service" },
  { icon: Award, label: "Fully Licensed", sub: "Active through 2027" },
];

const TrustBadges = () => {
  return (
    <section className="bg-primary py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {badges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                <badge.icon className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-heading font-semibold text-primary-foreground text-sm">{badge.label}</span>
              <span className="text-primary-foreground/50 text-xs">{badge.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
