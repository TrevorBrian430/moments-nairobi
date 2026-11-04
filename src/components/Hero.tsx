"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[70vh] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/bagpack 1.jpg"
        alt="Premium backpack from Moments Nairobi"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center md:text-left animate-fade-in">
        {/* Top Label */}
        <p className="text-sm uppercase tracking-widest text-white/80 mb-4">
          Men&apos;s Fashion &bull; Bags &bull; Accessories
        </p>

        {/* Main Heading */}
        <h1 className="font-heading text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Everyday Fits.
          <br />
          Every Occasion.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-white/80 max-w-xl mb-8 mx-auto md:mx-0">
          Premium bags, clothing &amp; accessories. Delivered to your door
          across Kenya.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-semibold rounded-full px-8 py-3 transition-colors duration-200"
          >
            Shop Now
          </Link>

          <a
            href="https://wa.me/254702947981?text=Hi%20Moments%20Nairobi!%20I'd%20like%20to%20browse%20your%20collection"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold rounded-full px-8 py-3 transition-colors duration-200"
          >
            <MessageCircle className="h-5 w-5" />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
