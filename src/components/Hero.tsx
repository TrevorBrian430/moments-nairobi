"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] md:min-h-[72vh] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/bagpack 1.jpg"
        alt="Premium LV monogram backpacks from Moments Nairobi"
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      {/* Gradient Overlays: dark on mobile bottom/center, subtle on desktop right */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/50 md:bg-gradient-to-r md:from-black/90 md:via-black/60 md:to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:py-24 md:py-28 text-center md:text-left animate-fade-in">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-semibold tracking-wider text-[#D4899A] uppercase mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B85C6E] animate-pulse" />
          <span>Men&apos;s Fashion &bull; Bags &bull; Accessories</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 max-w-2xl mx-auto md:mx-0">
          Everyday Fits.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
            Every Occasion.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-lg mb-6 sm:mb-8 leading-relaxed mx-auto md:mx-0">
          Premium designer backpacks, crossbody bags, streetwear denim &amp; essentials.
          Available for pickup in Nairobi CBD or countrywide delivery.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start max-w-sm sm:max-w-none mx-auto md:mx-0">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B85C6E] hover:bg-[#9A4A5A] text-white font-bold rounded-full px-7 py-3.5 text-sm shadow-xl transition-all duration-200 active:scale-95"
          >
            <span>Shop Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I'd%20like%20to%20order%20from%20your%20collection"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd59] text-white font-bold rounded-full px-7 py-3.5 text-sm shadow-xl transition-all duration-200 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Order via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
