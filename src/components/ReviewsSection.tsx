import { Star } from "lucide-react";

const reviews = [
  {
    name: "Maria S.",
    location: "Rio Rancho, NM",
    rating: 5,
    text: "On Time Construction added a beautiful master suite to our home. Johnny and his crew were professional, on time, and the quality exceeded our expectations. Highly recommend!",
  },
  {
    name: "David R.",
    location: "Albuquerque, NM",
    rating: 5,
    text: "We needed our roof replaced after storm damage. On Time Construction handled everything quickly and did a fantastic job. Fair price and great workmanship.",
  },
  {
    name: "Sandra L.",
    location: "Corrales, NM",
    rating: 5,
    text: "Johnny's team completely remodeled our kitchen and it looks amazing. They stayed on budget and finished ahead of schedule. True professionals from start to finish.",
  },
  {
    name: "Michael T.",
    location: "Albuquerque, NM",
    rating: 5,
    text: "We've used On Time Construction for multiple projects over the years. Always reliable, always quality work. They're the only contractor we trust for our property.",
  },
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Don't just take our word for it — hear from Albuquerque homeowners who trust On Time Construction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-background rounded-xl p-6 md:p-8 shadow-card border border-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-5 italic">"{review.text}"</p>
              <div>
                <span className="font-heading font-semibold text-foreground">{review.name}</span>
                <span className="text-muted-foreground text-sm ml-2">— {review.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
