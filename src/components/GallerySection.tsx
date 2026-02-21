import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const projects = [
  { src: gallery1, alt: "Custom home addition in Albuquerque, NM", label: "Home Addition" },
  { src: gallery2, alt: "Modern kitchen remodel by On Time Construction", label: "Kitchen Remodel" },
  { src: gallery3, alt: "Professional roofing contractor in Albuquerque", label: "Roofing" },
  { src: gallery4, alt: "Bathroom renovation in Albuquerque home", label: "Bathroom Remodel" },
  { src: gallery5, alt: "Commercial building renovation project", label: "Commercial" },
  { src: gallery6, alt: "Residential framing and structural construction", label: "New Construction" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 md:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-widest">Our Work</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Project Gallery
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            See the quality craftsmanship that's made On Time Construction Albuquerque's go-to general contractor for over 25 years.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.label} className="group relative rounded-xl overflow-hidden aspect-square shadow-card hover:shadow-card-hover transition-all duration-300">
              <img
                src={project.src}
                alt={project.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="font-heading font-bold text-primary-foreground text-lg">{project.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
