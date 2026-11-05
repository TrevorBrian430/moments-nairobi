"use client";

import { useState, useEffect } from "react";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { STORE_INFO } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const deliveryFee = 0; // Free for now
  const total = totalPrice() + deliveryFee;

  function generateCartWhatsAppMessage() {
    if (items.length === 0) return "";
    const itemLines = items
      .map(
        (item) =>
          `• ${item.name}${item.color ? ` (${item.color})` : ""}${
            item.size ? ` - Size ${item.size}` : ""
          } × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n");

    return `Hi Moments Nairobi! 👋\n\nI'd like to order:\n${itemLines}\n\nTotal: ${formatPrice(
      total
    )}\n\nDelivery to: [My address]\nPhone: [My phone number]`;
  }

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="animate-pulse space-y-4 max-w-sm w-full">
          <div className="h-12 bg-gray-100 rounded-full w-2/3 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything yet
        </p>
        <Link
          href="/shop"
          className="bg-brand text-white px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/shop" className="text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          Your Cart
        </h1>
        <span className="text-gray-500">({items.length} items)</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <CartItemRow
              key={`${item.productId}-${item.color}-${item.size}-${index}`}
              item={item}
              onUpdateQuantity={(qty) =>
                updateQuantity(item.productId, qty, item.color, item.size)
              }
              onRemove={() =>
                removeItem(item.productId, item.color, item.size)
              }
            />
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-danger transition-colors mt-4"
          >
            Clear all items
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h3 className="font-heading text-xl font-bold mb-6">
              Order Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-mpesa font-medium">
                  {deliveryFee === 0 ? "Free (Nairobi CBD)" : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* WhatsApp Order - Primary CTA for Kenya */}
            <a
              href={generateWhatsAppLink(
                STORE_INFO.phone,
                generateCartWhatsAppMessage()
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-whatsapp text-white py-3.5 rounded-full font-semibold hover:brightness-110 transition-all mb-3"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </a>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-brand text-white py-3.5 rounded-full font-semibold hover:bg-brand-dark transition-colors"
            >
              Proceed to Checkout
            </Link>

            <p className="text-xs text-gray-500 mt-4 text-center">
              💚 M-Pesa & Card payments available at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
        <div className="text-sm text-gray-500 mt-0.5">
          {item.color && <span>{item.color}</span>}
          {item.color && item.size && <span> • </span>}
          {item.size && <span>Size {item.size}</span>}
        </div>
        <p className="font-bold text-gray-900 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-danger transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-semibold w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
