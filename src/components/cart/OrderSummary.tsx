"use client";

import React from "react";
import Link from "next/link";
import { Price } from "@/components/ui/Price";
import { POLICIES } from "@/config/policies";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { type CartItem } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee?: number;
  deliveryLabel?: string;
  isCheckout?: boolean;
  className?: string;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  deliveryLabel,
  isCheckout = false,
  className,
}: OrderSummaryProps) {
  const hasUnavailableItems = items.some((i) => i.unavailable);
  const total = subtotal + (deliveryFee || 0);

  // Delivery text from policies.ts
  const displayDelivery =
    typeof deliveryFee === "number"
      ? deliveryFee === 0
        ? "Free (Nairobi CBD)"
        : `KES ${deliveryFee.toLocaleString("en-KE")}`
      : deliveryLabel || "Calculated at checkout";

  // Build WhatsApp URL
  const whatsappUrl = getWhatsAppOrderUrl({
    items: items.filter((i) => !i.unavailable),
    subtotal,
    deliveryFee: typeof deliveryFee === "number" ? deliveryFee : undefined,
    deliveryPreference: deliveryLabel,
  });

  return (
    <div
      className={cn(
        "rounded-[2px] border border-[#E4E0D8] bg-white p-5 sm:p-6 space-y-5",
        className
      )}
    >
      <h2 className="text-base font-medium text-[#111111] pb-3 border-b border-[#E4E0D8]">
        Order summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[#6B6B66]">
          <span>Subtotal</span>
          <Price amount={subtotal} className="text-[#111111] font-medium" />
        </div>

        <div className="flex justify-between text-[#6B6B66]">
          <span>Delivery</span>
          <span className="text-[#111111]">{displayDelivery}</span>
        </div>

        <div className="pt-3 border-t border-[#E4E0D8] flex justify-between text-base font-medium text-[#111111]">
          <span>Total</span>
          <Price amount={total} className="text-lg font-medium text-[#111111]" />
        </div>
      </div>

      {hasUnavailableItems && (
        <p className="text-xs text-[#B3261E] bg-[#B3261E]/5 p-2.5 rounded-[2px] border border-[#B3261E]/20">
          Some items in your cart are no longer available. Please remove them to proceed.
        </p>
      )}

      {!isCheckout && (
        <div className="space-y-2.5 pt-2">
          {hasUnavailableItems ? (
            <button
              disabled
              className="w-full h-[52px] rounded-[2px] bg-[#E4E0D8] text-[#6B6B66] text-sm font-medium cursor-not-allowed"
            >
              Checkout
            </button>
          ) : (
            <Link
              href="/checkout"
              className="w-full h-[52px] rounded-[2px] bg-[#BB4C6C] hover:bg-[#9A3E58] text-white text-sm font-medium flex items-center justify-center transition-colors active:translate-y-[1px]"
            >
              Checkout
            </Link>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[48px] rounded-[2px] border border-[#1FA855] text-[#1FA855] hover:bg-[#1FA855]/5 text-sm font-medium flex items-center justify-center transition-colors select-none"
          >
            Order on WhatsApp
          </a>

          {POLICIES.payments.acceptedLabel ? (
            <p className="text-xs text-[#6B6B66] text-center pt-1">
              {POLICIES.payments.acceptedLabel}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
