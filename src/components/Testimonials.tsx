import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Great quality bags! Ordered a Goyard-style backpack and it's amazing. Delivery was fast.",
    name: "Kevin M.",
    location: "Nairobi",
    rating: 5,
  },
  {
    quote:
      "Been buying from Moments for months. Always stylish, always affordable. Best men's fashion spot in CBD.",
    name: "Brian O.",
    location: "Mombasa",
    rating: 5,
  },
  {
    quote:
      "The crossbody bag is perfect for daily use. Compact but fits everything I need. Will order again!",
    name: "James K.",
    location: "Kisumu",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="min-w-[280px] sm:min-w-0 flex-shrink-0 sm:flex-shrink bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
      <div>
        <StarRating count={testimonial.rating} />
        <p className="text-gray-700 leading-relaxed mb-4 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
      <div>
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.location}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Happy Clients
          </h2>
          <p className="text-gray-500 text-lg">
            See what our customers say
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 scrollbar-hide">
          {testimonials.map((t) => (
            <div key={t.name} className="snap-start">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
