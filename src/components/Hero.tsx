import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HERO_CONFIG } from "@/config/hero";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-background)]">
      <Container className="h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[640px] lg:max-h-[760px] lg:h-[700px] items-stretch">
          {/* Left Column: Text Content (order-2 on mobile, order-1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center px-6 lg:px-0 py-8 sm:py-10 lg:py-0 text-left hero-animate-text z-10">
            {/* 1. Small label */}
            <SectionLabel className="mb-3 sm:mb-4">
              Nairobi CBD, Tom Mboya Street
            </SectionLabel>

            {/* 2. Headline */}
            <h1 className="font-heading font-medium text-[clamp(36px,5vw,72px)] leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] max-w-xl mb-4 sm:mb-5">
              Backpacks that fit a 15-inch laptop.
            </h1>

            {/* 3. Supporting copy */}
            <p className="text-[17px] leading-relaxed text-[var(--color-muted)] max-w-lg mb-6 sm:mb-8">
              Monogram and chevron print backpacks, crossbody bags and streetwear.
              From KES 1,500. Pick up in town within the hour.
            </p>

            {/* 4. Actions: One primary button + one text link */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-5 sm:mb-6 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                href="/shop?category=backpacks"
                className="w-full sm:w-auto min-h-[48px] px-8 text-sm"
              >
                Shop backpacks
              </Button>

              <Link
                href="/shop"
                className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] underline-offset-4 hover:underline py-2 transition-colors duration-200 text-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                Browse everything
              </Link>
            </div>

            {/* 5. Pickup / Courier factual line */}
            <p className="text-[13px] text-[var(--color-muted)]">
              Pickup at Twilight Suites F4-08. Courier countrywide.
            </p>
          </div>

          {/* Right Column: Image Panel (order-1 on mobile, order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-7 h-full w-full hero-animate-image hero-desktop-bleed relative">
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[640px] lg:max-h-[760px] rounded-none lg:rounded-[2px] overflow-hidden bg-[var(--color-surface-fallback)]">
              <Image
                src={HERO_CONFIG.src}
                alt={HERO_CONFIG.alt}
                fill
                priority
                quality={85}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
                style={{ objectPosition: HERO_CONFIG.objectPosition }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
