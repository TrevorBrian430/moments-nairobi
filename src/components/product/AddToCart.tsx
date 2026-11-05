"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { type Product } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface AddToCartProps {
  product: Product;
  selectedColor?: string;
  selectedVariantImage?: string;
  selectedSize?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}

export function AddToCart({
  product,
  selectedColor,
  selectedVariantImage,
  selectedSize,
  quantity = 1,
  disabled = false,
  className,
}: AddToCartProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const isOutOfStock =
    disabled ||
    !product.inStock ||
    (product.stockCount !== undefined && product.stockCount <= 0);

  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Use selected variant image if available, falling back to product primary image
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

  return (
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={handleAddToCart}
      className={cn(
        "w-full h-[52px] rounded-[2px] font-medium text-sm transition-colors flex items-center justify-center cursor-pointer select-none",
        isOutOfStock
          ? "bg-[#E4E0D8] text-[#6B6B66] cursor-not-allowed pointer-events-none"
          : added
          ? "bg-[#111111] text-white hover:bg-[#111111]/90"
          : "bg-[#BB4C6C] hover:bg-[#9A3E58] text-white active:translate-y-[1px]",
        className
      )}
    >
      {added ? (
        <span className="flex items-center gap-1.5 text-xs sm:text-sm">
          <span>Added.</span>
          <Link
            href="/cart"
            onClick={(e) => e.stopPropagation()}
            className="underline underline-offset-4 text-white hover:text-white/80 font-medium"
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
  );
}
