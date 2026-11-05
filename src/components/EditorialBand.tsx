import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EDITORIAL_CONFIG } from "@/config/editorial";

export default function EditorialBand() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-background)] py-14 lg:py-24">
      <Container>
        {/* Band Container: 560px on desktop */}
        <div className="relative w-full rounded-[2px] overflow-hidden lg:h-[560px] flex flex-col lg:flex-row items-stretch border border-[var(--color-hairline)] bg-[var(--color-surface-fallback)]">
          {/* Full Photo (no dark gradient overlay) */}
          <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0 lg:w-full lg:h-full">
            <Image
              src={EDITORIAL_CONFIG.src}
              alt={EDITORIAL_CONFIG.alt}
              fill
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
              style={{ objectPosition: EDITORIAL_CONFIG.objectPosition }}
            />
          </div>

          {/* Solid Off-white Text Panel Overlapping Image Left Edge */}
          <div className="relative z-10 w-full lg:max-w-md xl:max-w-lg bg-[var(--color-background)] p-8 sm:p-12 lg:my-auto lg:ml-10 xl:ml-16 rounded-[2px] border-t lg:border-t-0 lg:border border-[var(--color-hairline)] space-y-4">
            <SectionLabel>{EDITORIAL_CONFIG.label}</SectionLabel>

            <h2 className="font-heading font-medium text-[clamp(26px,3vw,36px)] leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
              {EDITORIAL_CONFIG.headline}
            </h2>

            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              {EDITORIAL_CONFIG.copy}
            </p>

            <div className="pt-2">
              <Link
                href={EDITORIAL_CONFIG.linkHref}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] underline-offset-4 hover:underline transition-colors py-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <span>{EDITORIAL_CONFIG.linkText}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
