"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { CartLine } from "./CartLine";
import { Price } from "@/components/ui/Price";
import { POLICIES } from "@/config/policies";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    totalItems,
    totalPrice,
    syncWithCatalog,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);
  const totalCount = totalItems();
  const subtotal = totalPrice();
  const hasUnavailable = items.some((i) => i.unavailable);

  // Sync prices and inventory on drawer open
  useEffect(() => {
    if (isDrawerOpen) {
      syncWithCatalog();
    }
  }, [isDrawerOpen, syncWithCatalog]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isDrawerOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    drawerRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart drawer"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer content: 420px desktop, full width mobile, shadow allowed */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-[420px] h-full bg-[#F6F4F0] border-l border-[#E4E0D8] shadow-2xl flex flex-col outline-none animate-slide-left"
      >
        {/* Header */}
        <div className="h-16 px-5 border-b border-[#E4E0D8] flex items-center justify-between shrink-0 bg-[#F6F4F0]">
          <h2 className="text-base font-medium text-[#111111]">
            Cart ({totalCount})
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
            className="w-11 h-11 -mr-2 flex items-center justify-center text-[#6B6B66] hover:text-[#111111] transition-colors cursor-pointer select-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: line items */}
        <div className="flex-1 overflow-y-auto px-5 divide-y divide-[#E4E0D8]">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="text-sm text-[#6B6B66]">Your cart is empty.</p>
              <div>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="text-xs font-medium text-[#BB4C6C] hover:underline underline-offset-4"
                >
                  Browse the shop
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <CartLine
                key={`${item.productId}-${item.color}-${item.size}`}
                item={item}
                compact
                onUpdateQuantity={(qty) =>
                  updateQuantity(item.productId, qty, item.color, item.size)
                }
                onRemove={() =>
                  removeItem(item.productId, item.color, item.size)
                }
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E4E0D8] bg-white space-y-4 shrink-0">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-[#6B6B66]">Subtotal</span>
              <Price amount={subtotal} className="text-base font-medium text-[#111111]" />
            </div>

            <p className="text-xs text-[#6B6B66]">
              {POLICIES.delivery.cartSummary}
            </p>

            {hasUnavailable ? (
              <button
                disabled
                className="w-full h-[52px] rounded-[2px] bg-[#E4E0D8] text-[#6B6B66] text-sm font-medium cursor-not-allowed"
              >
                Checkout
              </button>
            ) : (
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full h-[52px] rounded-[2px] bg-[#BB4C6C] hover:bg-[#9A3E58] text-white text-sm font-medium flex items-center justify-center transition-colors active:translate-y-[1px]"
              >
                Checkout
              </Link>
            )}

            <div className="text-center">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="text-xs text-[#6B6B66] hover:text-[#111111] transition-colors underline-offset-4 hover:underline"
              >
                View full cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
