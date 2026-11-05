"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { Container } from "@/components/ui/Container";
import { CartLine } from "@/components/cart/CartLine";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Price } from "@/components/ui/Price";
import { POLICIES } from "@/config/policies";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removedItemHistory, setRemovedItemHistory] = useState<{
    item: CartItem;
    index: number;
  } | null>(null);
  const [showStickyBottom, setShowStickyBottom] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);

  const {
    items,
    updateQuantity,
    removeItem,
    restoreItem,
    clearCart,
    totalItems,
    totalPrice,
    syncWithCatalog,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
    syncWithCatalog();
  }, [syncWithCatalog]);

  // Observer to show mobile sticky bar when summary scrolls out of view
  useEffect(() => {
    const target = summaryRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When summary is not intersecting and is above the viewport, show sticky bottom
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setShowStickyBottom(true);
        } else {
          setShowStickyBottom(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [mounted, items.length]);

  const totalCount = totalItems();
  const subtotal = totalPrice();
  const hasUnavailable = items.some((i) => i.unavailable);

  // Handle remove with 5-second undo
  const handleRemove = (item: CartItem, index: number) => {
    removeItem(item.productId, item.color, item.size);
    setRemovedItemHistory({ item, index });

    setTimeout(() => {
      setRemovedItemHistory((prev) =>
        prev?.item.productId === item.productId &&
        prev?.item.color === item.color &&
        prev?.item.size === item.size
          ? null
          : prev
      );
    }, 5000);
  };

  const handleUndo = () => {
    if (removedItemHistory) {
      restoreItem(removedItemHistory.item, removedItemHistory.index);
      setRemovedItemHistory(null);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-[#F6F4F0] min-h-[60vh] py-16 animate-pulse">
        <Container>
          <div className="h-8 w-40 bg-[#EDEAE4] rounded-[2px] mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="h-24 bg-[#EDEAE4] rounded-[2px]" />
              <div className="h-24 bg-[#EDEAE4] rounded-[2px]" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-64 bg-[#EDEAE4] rounded-[2px]" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#F6F4F0] min-h-[60vh] py-20 flex items-center justify-center">
        <Container className="text-center space-y-3">
          <p className="text-base text-[#6B6B66]">Your cart is empty.</p>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-[44px] px-6 rounded-[2px] bg-[#BB4C6C] text-white text-sm font-medium hover:bg-[#9A3E58] transition-colors"
            >
              Browse the shop
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const countLabel = `${totalCount} ${totalCount === 1 ? "item" : "items"}`;

  return (
    <div className="bg-[#F6F4F0] min-h-screen py-8 sm:py-12">
      <Container>
        {/* List Header */}
        <div className="flex items-baseline justify-between pb-6 mb-6 border-b border-[#E4E0D8]">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[#111111]">
              Cart
            </h1>
            <span className="text-sm text-[#6B6B66]">{countLabel}</span>
          </div>

          <div>
            {showClearConfirm ? (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#6B6B66]">Clear all items?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="text-[#B3261E] font-medium hover:underline"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-[#6B6B66] hover:text-[#111111]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-[#6B6B66] hover:text-[#111111] transition-colors cursor-pointer select-none"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        {/* 5-second Undo Banner */}
        {removedItemHistory && (
          <div className="mb-6 p-3 bg-white border border-[#E4E0D8] rounded-[2px] flex items-center justify-between text-xs text-[#111111] animate-fade-in">
            <span>Removed {removedItemHistory.item.name}.</span>
            <button
              type="button"
              onClick={handleUndo}
              className="text-[#BB4C6C] font-medium underline underline-offset-2 hover:text-[#9A3E58] cursor-pointer"
            >
              Undo
            </button>
          </div>
        )}

        {/* 12-Column Grid: 7 cols Items, 5 cols Sticky Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT 7 COLUMNS: ITEMS */}
          <div className="lg:col-span-7 divide-y divide-[#E4E0D8] border-b border-[#E4E0D8]">
            {items.map((item, index) => (
              <CartLine
                key={`${item.productId}-${item.color}-${item.size}`}
                item={item}
                onUpdateQuantity={(qty) =>
                  updateQuantity(item.productId, qty, item.color, item.size)
                }
                onRemove={() => handleRemove(item, index)}
              />
            ))}
          </div>

          {/* RIGHT 5 COLUMNS: SUMMARY (Sticky desktop) */}
          <div
            ref={summaryRef}
            className="lg:col-span-5 lg:sticky lg:top-[88px] space-y-4"
          >
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryLabel={POLICIES.delivery.cartSummary}
            />
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar (shown after summary scrolls out of view) */}
        {showStickyBottom && (
          <div
            aria-label="Checkout action bar"
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#F6F4F0] border-t border-[#E4E0D8] px-4 py-2 flex items-center justify-between gap-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xs"
          >
            <div>
              <p className="text-[11px] text-[#6B6B66]">Total</p>
              <Price amount={subtotal} className="text-base font-medium text-[#111111]" />
            </div>

            {hasUnavailable ? (
              <button
                disabled
                className="h-[44px] px-6 rounded-[2px] bg-[#E4E0D8] text-[#6B6B66] text-xs font-medium cursor-not-allowed"
              >
                Checkout
              </button>
            ) : (
              <Link
                href="/checkout"
                className="h-[44px] px-6 rounded-[2px] bg-[#BB4C6C] hover:bg-[#9A3E58] text-white text-xs font-medium flex items-center justify-center transition-colors select-none"
              >
                Checkout
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
