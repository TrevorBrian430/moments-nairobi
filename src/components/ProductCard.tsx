"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, MessageCircle, Heart, Star, Check } from "lucide-react";
import { cn, formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { STORE_INFO, type Product } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
  );

  const displayPrice = product.salePrice ?? product.price;

  const whatsappMessage = `Hi Moments Nairobi! I'm interested in ordering ${product.name}${
    selectedColor ? ` (${selectedColor})` : ""
  } - ${formatPrice(displayPrice)}`;

  const whatsappUrl = generateWhatsAppLink(
    STORE_INFO.whatsappPhone,
    whatsappMessage
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.images[0],
      color: selectedColor,
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const visibleColors = product.colors?.slice(0, 4) ?? [];
  const extraColorCount = (product.colors?.length ?? 0) - 4;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100",
        "shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200"
      )}
    >
      {/* Clickable Image container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-neutral-50 block"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges overlay */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-[#B85C6E] px-2.5 py-0.5 text-[11px] font-semibold text-white tracking-wide shadow-sm">
              NEW DROP
            </span>
          )}
          {product.salePrice && (
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-semibold text-white tracking-wide shadow-sm">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform hover:scale-110 shadow-sm",
            isWishlisted ? "text-[#B85C6E]" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <Heart
            className="h-4 w-4"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* WhatsApp quick order floating button */}
        <button
          type="button"
          onClick={handleWhatsApp}
          title="Order via WhatsApp"
          aria-label="Order via WhatsApp"
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Rating and category */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
          <span className="uppercase tracking-wider font-bold text-gray-400 text-[9px] sm:text-[10px] truncate max-w-[90px]">
            {product.category.replace("-", " ")}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
            <Star className="h-3 w-3 fill-current" />
            <span>5.0</span>
            <span className="text-gray-400 font-normal">(12)</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#B85C6E] transition-colors line-clamp-1 mb-1"
        >
          {product.name}
        </Link>

        {/* Color swatches preview */}
        {visibleColors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {visibleColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color.name);
                }}
                title={color.name}
                className={cn(
                  "h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border transition-all",
                  selectedColor === color.name
                    ? "ring-2 ring-[#B85C6E] ring-offset-1 scale-110"
                    : "border-gray-200 hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {extraColorCount > 0 && (
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-semibold">
                +{extraColorCount}
              </span>
            )}
          </div>
        )}

        {/* Price & Add to Cart button */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-1 border-t border-gray-50">
          <div className="min-w-0">
            <div className="text-xs sm:text-base font-extrabold text-gray-900 truncate">
              {formatPrice(displayPrice)}
            </div>
            {product.salePrice && (
              <div className="text-[10px] sm:text-xs text-gray-400 line-through truncate">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 shrink-0",
              addedAnimation
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white hover:bg-[#B85C6E] active:scale-95 shadow-sm"
            )}
          >
            {addedAnimation ? (
              <>
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
