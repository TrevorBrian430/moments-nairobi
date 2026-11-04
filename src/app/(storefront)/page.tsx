import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import CategoryCircles from "@/components/CategoryCircles";
import ProductGrid from "@/components/ProductGrid";
import PromoBar from "@/components/PromoBar";
import Testimonials from "@/components/Testimonials";
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
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured);
  const newArrivals = PRODUCTS.filter((p) => p.isNew);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero banner */}
      <Hero />

      {/* 2. Trust / Highlights banner (Kenya e-commerce essentials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-[#B85C6E]/10 flex items-center justify-center text-[#B85C6E] shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">
                Delivery Countrywide
              </div>
              <div className="text-xs text-gray-500">Free in Nairobi CBD</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">
                Physical Shop
              </div>
              <div className="text-xs text-gray-500">
                Tom Mboya, Twilight Suites F4-08
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">
                WhatsApp Orders
              </div>
              <div className="text-xs text-gray-500">Fast reply &amp; support</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">
                100% Quality Fits
              </div>
              <div className="text-xs text-gray-500">Carefully curated pieces</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Instagram Story style Category Circles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Curated everyday fits &amp; statement luxury bags
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-[#B85C6E] hover:underline flex items-center gap-1"
          >
            All Collections <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <CategoryCircles />
      </section>

      {/* 4. Popular Category Hero Cards (Inspired by Dribbble Ref 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Luxury Backpacks */}
          <Link
            href="/shop?category=backpacks"
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Image
              src="/images/bagpack 1.jpg"
              alt="Backpacks"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
                Laptops • Work • Campus
              </span>
              <h3 className="font-heading text-xl font-bold text-white mt-1">
                Designer Backpacks
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Spacious luxury fits starting KES 4,000
              </p>
            </div>
          </Link>

          {/* Card 2: Crossbody Bags */}
          <Link
            href="/shop?category=crossbody-bags"
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Image
              src="/images/crossbody-bag.jpg"
              alt="Crossbody Bags"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
                Daily Essentials
              </span>
              <h3 className="font-heading text-xl font-bold text-white mt-1">
                Crossbody Bags
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Compact, versatile everyday carry — KES 2,700
              </p>
            </div>
          </Link>

          {/* Card 3: Streetwear Clothing */}
          <Link
            href="/shop?category=clothing"
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Image
              src="/images/shacket-white.jpg"
              alt="Streetwear Clothing"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#D4899A]">
                Fresh Fits
              </span>
              <h3 className="font-heading text-xl font-bold text-white mt-1">
                Streetwear &amp; Jeans
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Wide leg denim, shackets &amp; graphic tees
              </p>
            </div>
          </Link>
        </div>
      </section>

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
            <div className="p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>HOT ITEM • GOYARD PATTERN</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
                Goyard-Style Luxury Backpack
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Engineered with high-grade durable coated canvas, signature chevron
                motifs, and designed to comfortably hold a 15-inch laptop. Available in
                striking Blue, Green, Maroon, Black, Grey &amp; Brown.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <div className="text-xs text-gray-400">Fits Laptop</div>
                  <div className="text-sm font-semibold text-white">15-inch</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <div className="text-xs text-gray-400">Price</div>
                  <div className="text-sm font-semibold text-white">KES 4,500</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <div className="text-xs text-gray-400">Delivery</div>
                  <div className="text-sm font-semibold text-green-400">Free in CBD</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/product/goyard-style-backpack"
                  className="rounded-full bg-[#B85C6E] hover:bg-[#9A4A5A] text-white px-7 py-3 text-sm font-semibold transition-colors duration-200"
                >
                  View Details &amp; Colors
                </Link>
                <a
                  href="https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I%20want%20to%20order%20the%20Goyard-Style%20Backpack%20(KES%204,500)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25D366] hover:bg-[#20bd59] text-white px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </a>
              </div>
            </div>

            <div className="relative aspect-square lg:aspect-auto lg:h-[520px] w-full bg-neutral-800">
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

      {/* 9. Physical Store Location & Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-900 to-gray-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4899A]">
                VISIT OUR STORE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Experience Moments in Nairobi CBD
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Want to touch the fabric, test the zippers, or pick up your order directly?
                Drop by our shop in the heart of Nairobi.
              </p>

              <div className="space-y-3 pt-2 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#B85C6E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Location:</span>{" "}
                    {STORE_INFO.address}
                    <div className="text-xs text-gray-400">
                      {STORE_INFO.addressDetail}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#B85C6E] shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Call/WhatsApp:</span>{" "}
                    <a
                      href={`tel:${STORE_INFO.phone}`}
                      className="text-white hover:text-[#D4899A] underline"
                    >
                      {STORE_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
              <h3 className="font-heading text-xl font-bold text-white">
                Store Hours &amp; Pickup
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
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

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I'm%20visiting%20your%20shop%20at%20Twilight%20Suites.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#25D366] text-white py-3 rounded-full text-xs font-semibold hover:bg-[#20bd59] transition-colors"
                >
                  Chat with Shop Attendant
                </a>
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-full text-xs font-semibold transition-colors border border-white/20"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
