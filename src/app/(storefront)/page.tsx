import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import CategoryCircles from "@/components/CategoryCircles";
import ProductGrid from "@/components/ProductGrid";
import PromoBar from "@/components/PromoBar";
import Testimonials from "@/components/Testimonials";
import MarqueeBanner from "@/components/MarqueeBanner";
import EditorialStory from "@/components/EditorialStory";
import InstagramFeed from "@/components/InstagramFeed";
import { PRODUCTS, STORE_INFO } from "@/lib/constants";
import {
  Truck,
  MapPin,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-16 w-full max-w-full overflow-x-hidden">
      {/* 1. Hero banner */}
      <Hero />

      {/* 2. Trust / Highlights banner (Kenya e-commerce essentials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-3 sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-[#B85C6E]/10 flex items-center justify-center text-[#B85C6E] shrink-0">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">
                Delivery Countrywide
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">Free in Nairobi CBD</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">
                Physical Shop
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                Tom Mboya, Twilight F4-08
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">
                WhatsApp Orders
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">0702 947 981</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">
                100% Quality Fits
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">Carefully curated pieces</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. High-Fashion Marquee Ticker */}
      <MarqueeBanner variant="dark" />

      {/* 4. Instagram Story style Category Circles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Curated everyday fits &amp; statement luxury bags
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-[#B85C6E] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All Collections</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <CategoryCircles />
      </section>

      {/* 5. Editorial Lookbook & Spotlight Stories */}
      <EditorialStory />

      {/* 5. Main Product Catalog Grid with filter tabs & sort */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid
          products={PRODUCTS}
          title="Trending Essentials For You"
          showFilters={true}
        />
      </section>

      {/* 6. Spotlight Showcase: Goyard-Style Backpack Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 text-white overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-6 sm:p-10 lg:p-16 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>HOT ITEM • GOYARD PATTERN</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Goyard-Style Luxury Backpack
              </h2>
              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm sm:leading-relaxed">
                Engineered with high-grade durable coated canvas, signature chevron
                motifs, and designed to comfortably hold a 15-inch laptop. Available in
                striking Blue, Green, Maroon, Black, Grey &amp; Brown.
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-gray-400">Fits Laptop</div>
                  <div className="text-xs sm:text-sm font-bold text-white">15-inch</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-gray-400">Price</div>
                  <div className="text-xs sm:text-sm font-bold text-white">KES 4,500</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-gray-400">Delivery</div>
                  <div className="text-xs sm:text-sm font-bold text-green-400">Free in CBD</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/product/goyard-style-backpack"
                  className="text-center rounded-full bg-[#B85C6E] hover:bg-[#9A4A5A] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-lg transition-colors"
                >
                  View Details &amp; Colors
                </Link>
                <a
                  href="https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I%20want%20to%20order%20the%20Goyard-Style%20Backpack%20(KES%204,500)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center rounded-full bg-[#25D366] hover:bg-[#20bd59] text-white px-6 py-3 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="relative aspect-square lg:aspect-auto lg:h-[480px] w-full bg-neutral-800">
              <Image
                src="/images/goyard style blue.jpg"
                alt="Goyard-Style Luxury Backpack"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Mid-page Promo Banner */}
      <PromoBar />

      {/* 8. Happy Clients / Testimonials */}
      <Testimonials />

      {/* 9. Live Instagram Street Style Community Grid */}
      <InstagramFeed />

      {/* 10. Physical Store Location & Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-900 to-gray-900 rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4899A]">
                VISIT OUR STORE
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
                Experience Moments in Nairobi CBD
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Want to touch the fabric, test the zippers, or pick up your order directly?
                Drop by our shop in the heart of Nairobi.
              </p>

              <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-gray-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Location:</span>{" "}
                    {STORE_INFO.address}
                    <div className="text-[11px] text-gray-400">
                      {STORE_INFO.addressDetail}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#B85C6E] shrink-0" />
                  <div>
                    <span className="font-bold text-white">Call/WhatsApp:</span>{" "}
                    <a
                      href={`tel:${STORE_INFO.phone}`}
                      className="text-white hover:text-[#D4899A] underline font-semibold"
                    >
                      {STORE_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 backdrop-blur-md space-y-4">
              <h3 className="font-heading text-base sm:text-xl font-bold text-white">
                Store Hours &amp; Pickup
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Monday – Friday:</span>
                  <span className="font-semibold text-white">8:30 AM – 7:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Saturday:</span>
                  <span className="font-semibold text-white">9:00 AM – 7:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold text-amber-300">Available on Call / WhatsApp</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I'm%20visiting%20your%20shop%20at%20Twilight%20Suites.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#25D366] text-white py-3 rounded-full text-xs font-bold hover:bg-[#20bd59] transition-colors"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-full text-xs font-bold transition-colors border border-white/20"
                >
                  Call Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
