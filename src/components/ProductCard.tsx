"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/lib/constants";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/stores/cart-store";
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

  // Check if product has a createdAt date within the last 14 days
  const productDate = (product as { createdAt?: string }).createdAt;
  const isRecent = productDate
    ? Date.now() - new Date(productDate).getTime() < 14 * 24 * 60 * 60 * 1000
    : false;

  const hasSecondImage = product.images && product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/images/bagpack 1.jpg",
      color: product.colors?.[0]?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group flex flex-col w-full text-left select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[2px]",
        className
      )}
      aria-label={`${product.name} - KES ${product.price.toLocaleString("en-KE")}`}
    >
      {/* 4:5 Product Image Container with #EDEAE4 fallback */}
      <div className="relative aspect-[4/5] w-full rounded-[2px] overflow-hidden bg-[var(--color-surface-fallback)]">
        {/* Optional "New" tag if under 14 days old */}
        {isRecent && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] uppercase tracking-[0.08em] font-medium bg-[var(--color-surface)] text-[var(--color-ink)] px-2 py-0.5 rounded-[2px] border border-[var(--color-hairline)] pointer-events-none">
            New
          </span>
        )}

        {/* Primary Image */}
        <Image
          src={product.images[0] || "/images/bagpack 1.jpg"}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
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
            alt={`${product.name} alternate view`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
          />
        )}

        {/* Desktop Quick Add Button on Hover */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="hidden lg:block absolute bottom-0 inset-x-0 bg-[var(--color-surface)]/95 text-[var(--color-ink)] text-xs font-medium py-2.5 text-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[var(--color-accent)] hover:text-white cursor-pointer touch-manipulation z-20 border-t border-[var(--color-hairline)]"
        >
          {added ? "Added to bag" : "Quick add"}
        </button>
      </div>

      {/* Info Block Below Image */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-200 truncate">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <Price amount={product.price} size="sm" />

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
  );
}

export default ProductCard;
