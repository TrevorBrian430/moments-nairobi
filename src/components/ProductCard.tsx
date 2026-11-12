"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/lib/constants";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/stores/cart-store";
import { cleanBrandName } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const [viewedAt] = useState(() => product.createdAt ? Date.now() : 0);
  const age = product.createdAt ? viewedAt - Date.parse(product.createdAt) : Infinity;
  const isRecent = product.isNew && age >= 0 && age < 14 * 86_400_000;
  const name = cleanBrandName(product.name);
  const price = product.salePrice ?? product.price;
  const available = product.inStock && (product.stockCount ?? 10) > 0;
  const primaryImage = product.images[0] || "/images/bagpack 1.jpg";

  const hasSecondImage = product.images && product.images.length > 1;

  const handleQuickAdd = () => {
    if (!available) return;
    const variant = product.colors?.[0];
    const image = variant?.image ?? primaryImage;
    addItem({
      productId: product.id,
      name,
      price,
      image,
      color: variant?.name,
      size: product.sizes?.[0],
      variantId: variant ? `${product.id}-${variant.name}` : product.id,
      variantLabel: variant?.name,
      variantImage: image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={cn("group relative w-full", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="flex w-full flex-col rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`${name} - KES ${price.toLocaleString("en-KE")}`}
      >
        {/* 4:5 Product Image Container with #EDEAE4 fallback */}
        <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-[var(--color-surface-fallback)]">
          {/* Optional "New" tag if under 14 days old */}
          {isRecent && (
            <span className="absolute top-2.5 left-2.5 z-10 text-[10px] uppercase tracking-[0.08em] font-medium bg-[var(--color-surface)] text-[var(--color-ink)] px-2 py-0.5 rounded-sm border border-[var(--color-hairline)] pointer-events-none">
              New
            </span>
          )}

          {/* Primary Image */}
          <Image
            src={primaryImage}
            unoptimized={primaryImage.startsWith("https://")}
            alt={name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, 50vw"
            priority={priority}
            className={cn(
              "object-cover object-center transition-all duration-300 ease-out",
              hasSecondImage && "group-hover:opacity-0"
            )}
          />

          {/* Secondary Image on Hover (if available) */}
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              unoptimized={(product.images[1]).startsWith("https://")}
              alt={`${name} alternate view`}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, 50vw"
              className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />
          )}

        </div>

        {/* Info Block Below Image */}
        <div className="pt-3 pb-1 flex flex-col gap-1">
          <h3 className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-200 truncate">
            {name}
          </h3>

          <div className="flex items-center justify-between gap-2">
            <Price amount={price} size="sm" />

            {/* 12px Color Swatches (only if variants exist) */}
            {product.colors && product.colors.length > 0 && (
              <div
                className="flex items-center gap-1 shrink-0"
                aria-label={`${product.colors.length} color variants`}
              >
                {product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="h-3 w-3 rounded-full border border-[var(--color-hairline)] shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-[var(--color-muted)] leading-none">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
      {available && (
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden aspect-[4/5] lg:block">
          <button type="button" onClick={handleQuickAdd}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 min-h-11 border-t border-hairline bg-surface/95 text-xs font-medium text-ink opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100">
            {added ? "Added to cart" : "Quick add"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
