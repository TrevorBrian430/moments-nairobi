import { MessageCircle } from "lucide-react";

export default function PromoBar() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand to-brand-dark">
      {/* Decorative circles */}
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-1/3 h-32 w-32 -translate-y-1/2 rounded-full bg-white/5 hidden sm:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Text */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Your First Order?
          </h3>
          <p className="text-white/90 text-lg">
            Get <span className="font-semibold">10% off</span> when you order
            via WhatsApp
          </p>
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I'd%20like%20to%20claim%20my%2010%25%20discount"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full px-8 py-3 transition-colors duration-200 shadow-lg flex-shrink-0"
        >
          <MessageCircle className="h-5 w-5 text-whatsapp" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
