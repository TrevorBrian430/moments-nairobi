import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { CATEGORIES_CONFIG, type CategoryConfig } from "@/config/categories";
import { PRODUCTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function CategoryTiles() {
  // Pre-calculate real product counts per category
  const getProductCount = (slug: string) => {
    const count = PRODUCTS.filter((p) => p.category === slug).length;
    return count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : null;
  };

  const backpacks = CATEGORIES_CONFIG.find((c) => c.slug === "backpacks")!;
  const crossbody = CATEGORIES_CONFIG.find((c) => c.slug === "crossbody-bags")!;
  const designer = CATEGORIES_CONFIG.find((c) => c.slug === "designer-bags")!;
  const clothing = CATEGORIES_CONFIG.find((c) => c.slug === "clothing")!;
  const accessories = CATEGORIES_CONFIG.find((c) => c.slug === "accessories")!;

  const renderTile = (cat: CategoryConfig, aspectClass: string) => {
    const itemCount = getProductCount(cat.slug);

    return (
      <Link
        key={cat.slug}
        href={`/shop?category=${cat.slug}`}
        className="group flex flex-col w-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[2px]"
      >
        {/* Image panel with 1.03x hover zoom and #EDEAE4 fallback */}
        <div
          className={cn(
            "relative w-full rounded-[2px] overflow-hidden bg-[var(--color-surface-fallback)]",
            aspectClass
          )}
        >
          <Image
            src={cat.src}
            alt={cat.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: cat.objectPosition }}
          />
        </div>

        {/* Content strictly BELOW image (no overlay, no gradients) */}
        <div className="pt-3 pb-1 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base sm:text-lg font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
              {cat.label}
            </h3>
            {itemCount && (
              <span className="text-xs text-[var(--color-muted)] font-normal">
                {itemCount}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] group-hover:underline underline-offset-4 transition-colors">
            <span>Explore</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-14 lg:py-24 bg-[var(--color-background)]">
      <Container>
        <SectionHeader
          title="Categories"
          link={{ href: "/shop", label: "View all collections" }}
        />

        {/* Asymmetric 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Top Left: Tall Backpacks tile (5 cols, aspect 4:5) */}
          <div className="lg:col-span-5 flex flex-col">
            {renderTile(backpacks, "aspect-[4/5]")}
          </div>

          {/* Top Right: Two stacked tiles (7 cols, each aspect 16:9) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 sm:gap-8">
            {renderTile(crossbody, "aspect-[16/9]")}
            {renderTile(designer, "aspect-[16/9]")}
          </div>

          {/* Bottom Row: Clothing and Accessories (6 cols each, aspect 3:2) */}
          <div className="lg:col-span-6 flex flex-col">
            {renderTile(clothing, "aspect-[3/2]")}
          </div>
          <div className="lg:col-span-6 flex flex-col">
            {renderTile(accessories, "aspect-[3/2]")}
          </div>
        </div>
      </Container>
    </section>
  );
}
