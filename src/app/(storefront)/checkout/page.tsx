"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { STORE_INFO, DELIVERY_ZONES } from "@/lib/constants";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"details" | "payment" | "confirmation">(
    "details"
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryZone: "Nairobi CBD",
    address: "",
    notes: "",
    paymentMethod: "whatsapp" as "whatsapp" | "mpesa" | "card",
  });

  const deliveryZone = DELIVERY_ZONES.find(
    (z) => z.name === formData.deliveryZone
  );
  const deliveryFee = deliveryZone?.fee ?? 0;
  const total = totalPrice() + deliveryFee;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.paymentMethod === "whatsapp") {
      const itemLines = items
        .map(
          (item) =>
            `• ${item.name}${item.color ? ` (${item.color})` : ""}${
              item.size ? ` - Size ${item.size}` : ""
            } × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
        )
        .join("\n");

      const message = `Hi Moments Nairobi! 👋\n\nI'd like to order:\n${itemLines}\n\nSubtotal: ${formatPrice(
        totalPrice()
      )}\nDelivery (${formData.deliveryZone}): ${
        deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)
      }\nTotal: ${formatPrice(total)}\n\nName: ${formData.name}\nPhone: ${
        formData.phone
      }\nDelivery to: ${formData.address}\n${
        formData.notes ? `Notes: ${formData.notes}` : ""
      }`;

      window.open(
        generateWhatsAppLink(STORE_INFO.phone, message),
        "_blank"
      );
      setStep("confirmation");
    } else {
      // M-Pesa / Card — for now show WhatsApp fallback
      setStep("confirmation");
    }
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="font-heading text-2xl font-bold mb-4">
          No items to checkout
        </h2>
        <Link
          href="/shop"
          className="bg-brand text-white px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="w-20 h-20 text-mpesa mb-6" />
        <h2 className="font-heading text-3xl font-bold mb-2">
          Order Placed! 🎉
        </h2>
        <p className="text-gray-600 mb-2 max-w-md">
          Your order has been sent via WhatsApp. Our team will confirm and
          arrange delivery shortly.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You can also call us at{" "}
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="text-brand font-semibold"
          >
            {STORE_INFO.phone}
          </a>
        </p>
        <Link
          href="/shop"
          className="bg-brand text-white px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors"
          onClick={() => clearCart()}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/cart"
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-3xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-brand" />
                Contact Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                    placeholder="0712 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand" />
                Delivery
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Zone *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {DELIVERY_ZONES.map((zone) => (
                      <button
                        key={zone.name}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            deliveryZone: zone.name,
                          })
                        }
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          formData.deliveryZone === zone.name
                            ? "border-brand bg-brand/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-medium text-sm">{zone.name}</div>
                        <div
                          className={`text-sm ${
                            zone.fee === 0
                              ? "text-mpesa font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          {zone.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
                    rows={3}
                    placeholder="Estate, building, street..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
                    rows={2}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand" />
                Payment Method
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "whatsapp" })
                  }
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    formData.paymentMethod === "whatsapp"
                      ? "border-whatsapp bg-whatsapp/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <MessageCircle
                    className={`w-6 h-6 ${
                      formData.paymentMethod === "whatsapp"
                        ? "text-whatsapp"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      Order via WhatsApp
                    </div>
                    <div className="text-xs text-gray-500">
                      Chat with us to confirm & pay on delivery
                    </div>
                  </div>
                  {formData.paymentMethod === "whatsapp" && (
                    <span className="ml-auto text-xs bg-whatsapp text-white px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "mpesa" })
                  }
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    formData.paymentMethod === "mpesa"
                      ? "border-mpesa bg-mpesa/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      formData.paymentMethod === "mpesa"
                        ? "bg-mpesa text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    M
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      M-Pesa
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay via STK push (coming soon)
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h3 className="font-heading text-xl font-bold mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery ({formData.deliveryZone})</span>
                  <span
                    className={
                      deliveryFee === 0 ? "text-mpesa font-semibold" : ""
                    }
                  >
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-6 py-3.5 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                  formData.paymentMethod === "whatsapp"
                    ? "bg-whatsapp text-white hover:brightness-110"
                    : "bg-brand text-white hover:bg-brand-dark"
                }`}
              >
                {formData.paymentMethod === "whatsapp" ? (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Complete Order via WhatsApp
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
