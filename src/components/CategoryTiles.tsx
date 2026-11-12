"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { CATEGORIES_CONFIG, type CategoryConfig } from "@/config/categories";
import { useProductsStore } from "@/stores/products-store";
import { cn } from "@/lib/utils";

export default function CategoryTiles() {
  const categories = useProductsStore((s) => s.categories);
  const products = useProductsStore((s) => s.products);
  const getProductCount = (slug: string) => {
    const count = products.filter((p) => p.category === slug).length;
    return count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : null;
  };

  const tiles = categories.map((category) => {
    const editorial = CATEGORIES_CONFIG.find(({ slug }) => slug === category.slug);
    return {
      slug: category.slug,
      label: category.name,
      src: category.image,
      alt: category.name,
      objectPosition: editorial?.objectPosition ?? "center",
    };
  });

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
            unoptimized={cat.src.startsWith("https://")}
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

  const [backpacks, crossbody, designer, clothing, accessories] = CATEGORIES_CONFIG.map(({ slug }) =>
    tiles.find((tile) => tile.slug === slug),
  );
  const hasEditorialLayout = backpacks && crossbody && designer && clothing && accessories;
  const extraTiles = hasEditorialLayout
    ? tiles.filter((tile) => !CATEGORIES_CONFIG.some(({ slug }) => slug === tile.slug))
    : tiles;
  if (!tiles.length) return null;

  return (
    <section className="py-14 lg:py-24 bg-[var(--color-background)]">
      <Container>
        <SectionHeader
          title="Categories"
          link={{ href: "/shop", label: "View all collections" }}
        />

        {hasEditorialLayout && (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">{renderTile(backpacks, "aspect-[4/5]")}</div>
            <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:col-span-7">
              {renderTile(crossbody, "aspect-[16/9]")}
              {renderTile(designer, "aspect-[16/9]")}
            </div>
            <div className="lg:col-span-6">{renderTile(clothing, "aspect-[3/2]")}</div>
            <div className="lg:col-span-6">{renderTile(accessories, "aspect-[3/2]")}</div>
          </div>
        )}
        {extraTiles.length > 0 && (
          <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3", hasEditorialLayout && "mt-6 sm:mt-8")}>
            {extraTiles.map((category) => renderTile(category, "aspect-[4/3]"))}
          </div>
        )}
      </Container>
    </section>
  );
}
