"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Sparkles, ShieldCheck, Truck } from "lucide-react";

export default function EditorialStory() {
  return (
    <div className="w-full space-y-12 sm:space-y-16">
      {/* 1. 3-Card High-Fashion Category Spotlight */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B85C6E] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              CURATED COLLECTIONS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
              Elevate Your Everyday Carry
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#B85C6E] transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse All Collections</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Backpacks */}
          <Link
            href="/shop?category=backpacks"
            className="group relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-500 block"
          >
            <Image
              src="/images/bagpack 1.jpg"
              alt="Designer Backpacks"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white space-y-1.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Laptops • Work • Travel
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-black">
                Designer Backpacks
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2">
                Spacious compartments engineered for 15-inch laptops and all-day comfort.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                <span>Explore Collection</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Card 2: Crossbody Bags */}
          <Link
            href="/shop?category=crossbody-bags"
            className="group relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-500 block"
          >
            <Image
              src="/images/crossbody-bag.jpg"
              alt="Everyday Crossbody Bags"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white space-y-1.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                Phone • Keys • Passport
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-black">
                Everyday Crossbody
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2">
                Compact, lightweight, and versatile everyday carry for life on the go.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-green-300 transition-colors">
                <span>Shop Crossbody</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Card 3: Streetwear Clothing */}
          <Link
            href="/shop?category=clothing"
            className="group relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-500 block"
          >
            <Image
              src="/images/shacket-white.jpg"
              alt="Streetwear Clothing"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white space-y-1.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded-full border border-pink-400/20">
                Shackets • Denim • Sets
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-black">
                Streetwear Apparel
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2">
                Modern boxy silhouettes, textured fabrics, and effortless daily fits.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                <span>View Apparel</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. Dual-Split Editorial Brand Feature */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gray-950 text-white grid grid-cols-1 lg:grid-cols-12 border border-white/10 shadow-2xl">
          {/* Left image column */}
          <div className="relative h-72 sm:h-96 lg:h-auto lg:col-span-6 bg-neutral-900">
            <Image
              src="/images/bagpack 2.jpg"
              alt="Moments Nairobi Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-gray-950" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] font-bold tracking-widest uppercase text-amber-400">
              Twilight Suites F4-08
            </div>
          </div>

          {/* Right text editorial column */}
          <div className="p-6 sm:p-10 lg:p-12 lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#B85C6E]">
              <MapPin className="h-4 w-4" />
              <span>Tom Mboya Street &bull; Nairobi CBD</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-black leading-tight text-white">
              BUILT FOR THE STREETS. CURATED FOR EVERY MOMENT.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Moments Nairobi is redefining men&apos;s style in East Africa. We bridge the gap between luxury runway aesthetics and everyday functionality. Whether heading to a board meeting, campus lecture, or weekend road trip, our bags and apparel ensure you stand out.
            </p>

            {/* Feature pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#B85C6E] shrink-0" />
                <span>100% Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-400 shrink-0" />
                <span>CBD Free Same-Day</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Exclusive Small Batches</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="bg-[#B85C6E] hover:bg-[#9A4A5A] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg transition-all active:scale-95"
              >
                Explore All Products
              </Link>
              <a
                href="https://wa.me/254702947981"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-all active:scale-95"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
