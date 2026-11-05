"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { type Product } from "@/lib/constants";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export interface StickyMobileBarProps {
  product: Product;
  selectedColor?: string;
  selectedVariantImage?: string;
  selectedSize?: string;
  quantity?: number;
  triggerRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
}

export function StickyMobileBar({
  product,
  selectedColor,
  selectedVariantImage,
  selectedSize,
  quantity = 1,
  triggerRef,
  disabled = false,
}: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const isOutOfStock =
    disabled ||
    !product.inStock ||
    (product.stockCount !== undefined && product.stockCount <= 0);

  const displayPrice = product.salePrice ?? product.price;

  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;

    // Use IntersectionObserver to detect when the main button scrolls out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When main button is NOT intersecting and is above the viewport (top < 0), show sticky bar
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [triggerRef]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const chosenImage =
      selectedVariantImage || product.images[0] || "/images/bagpack 1.jpg";

    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: chosenImage,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      variantId: selectedColor ? `${product.id}-${selectedColor}` : product.id,
      variantLabel: selectedColor,
      variantImage: chosenImage,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <div
      aria-label="Quick purchase bar"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#F6F4F0] border-t border-[#E4E0D8] px-4 py-2 flex items-center justify-between gap-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xs"
    >
      <div className="min-w-0">
        <Price amount={displayPrice} size="sm" className="font-medium text-sm text-[#111111]" />
        {selectedColor && (
          <p className="text-[11px] text-[#6B6B66] truncate">{selectedColor}</p>
        )}
      </div>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={cn(
          "h-[40px] px-5 rounded-[2px] text-xs font-medium transition-colors flex items-center justify-center shrink-0 cursor-pointer touch-manipulation select-none",
          isOutOfStock
            ? "bg-[#E4E0D8] text-[#6B6B66] cursor-not-allowed pointer-events-none"
            : added
            ? "bg-[#111111] text-white"
            : "bg-[#BB4C6C] hover:bg-[#9A3E58] text-white active:translate-y-[1px]"
        )}
      >
        {added ? (
          <span className="flex items-center gap-1">
            <span>Added.</span>
            <Link
              href="/cart"
              onClick={(e) => e.stopPropagation()}
              className="underline underline-offset-2 ml-1 text-white font-medium"
            >
              View cart
            </Link>
          </span>
        ) : isOutOfStock ? (
          "Sold out"
        ) : (
          "Add to cart"
        )}
      </button>
    </div>
  );
}
