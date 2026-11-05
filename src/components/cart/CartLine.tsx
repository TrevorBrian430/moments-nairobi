"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type CartItem } from "@/stores/cart-store";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { cleanBrandName } from "@/lib/whatsapp";
import { PRODUCTS } from "@/lib/constants";

export interface CartLineProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  compact?: boolean; // For drawer use
}

export function CartLine({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartLineProps) {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  const productSlug = product?.slug || item.productId;
  const cleanedName = cleanBrandName(item.name);

  const displayImage =
    item.variantImage || item.image || "/images/bagpack 1.jpg";
  const lineTotal = item.price * item.quantity;
  const maxStock = product?.stockCount || 10;

  return (
    <div
      className={`py-4 flex gap-4 items-start ${
        item.unavailable ? "opacity-60" : ""
      }`}
    >
      {/* 96px (compact: 72px) 4:5 thumbnail */}
      <Link
        href={`/product/${productSlug}`}
        className={`relative shrink-0 rounded-[2px] bg-[#EDEAE4] overflow-hidden border border-[#E4E0D8] ${
          compact ? "w-[72px] aspect-[4/5]" : "w-[96px] aspect-[4/5]"
        }`}
      >
        <Image
          src={displayImage}
          alt={cleanedName}
          fill
          sizes={compact ? "72px" : "96px"}
          className="object-cover"
        />
      </Link>

      {/* Item info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${productSlug}`}
              className="text-sm font-medium text-[#111111] hover:text-[#BB4C6C] transition-colors truncate"
            >
              {cleanedName}
            </Link>

            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-[#6B6B66] hover:text-[#111111] transition-colors cursor-pointer select-none shrink-0"
              aria-label={`Remove ${cleanedName} from cart`}
            >
              Remove
            </button>
          </div>

          {/* Variant Label */}
          {(item.variantLabel || item.color || item.size) && (
            <p className="text-xs text-[#6B6B66] truncate">
              {[item.variantLabel || item.color, item.size ? `Size ${item.size}` : null]
                .filter(Boolean)
                .join(" / ")}
            </p>
          )}

          {/* Price status badges */}
          {item.priceUpdated && (
            <p className="text-[11px] text-[#BB4C6C] font-medium">
              Price updated
            </p>
          )}

          {item.unavailable && (
            <p className="text-[11px] text-[#B3261E] font-medium">
              No longer available
            </p>
          )}
        </div>

        {/* Stepper + Price row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {item.unavailable ? (
            <span className="text-xs text-[#B3261E]">Out of stock</span>
          ) : (
            <QuantityStepper
              quantity={item.quantity}
              onChange={onUpdateQuantity}
              max={maxStock}
              className={compact ? "scale-90 origin-left" : ""}
            />
          )}

          <div className="text-right">
            <Price
              amount={lineTotal}
              size={compact ? "sm" : "md"}
              className="font-medium text-[#111111]"
            />
            {!compact && item.quantity > 1 && (
              <p className="text-[11px] text-[#6B6B66]">
                KES {item.price.toLocaleString("en-KE")} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
