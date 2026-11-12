"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { refreshCatalog, useProductsStore } from "@/stores/products-store";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { DeliveryMethod } from "@/components/checkout/DeliveryMethod";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { cleanBrandName } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";

function normalizeKenyanPhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (/^(\+254|254)[17]\d{8}$/.test(cleaned)) {
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  }
  if (/^0[17]\d{8}$/.test(cleaned)) {
    return `+254${cleaned.slice(1)}`;
  }
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const { items, totalPrice, clearCart, syncWithCatalog } = useCartStore();
  const towns = useProductsStore((s) => s.towns);
  const catalogReady = useProductsStore((s) => s.ready);

  const submitting = useRef(false);
  const attempt = useRef<{ key: string; payload: string; expectedTotal: number } | undefined>(undefined);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "courier">("pickup");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pickup");

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Sync catalog on mount
  useEffect(() => {
    setMounted(true);
    syncWithCatalog();

    // Restore from sessionStorage if exists
    try {
      const saved = sessionStorage.getItem("moments_checkout_form");
      if (saved) {
        const parsed = JSON.parse(saved);
        setName(parsed.name || "");
        setPhone(parsed.phone || "");
        setEmail(parsed.email || "");
        setDeliveryMethod(parsed.deliveryMethod || "pickup");
        setTown(parsed.town || "");
        setAddress(parsed.address || "");
        setLandmark(parsed.landmark || "");
        setNotes(parsed.notes || "");
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, [syncWithCatalog]);

  // Persist form state to sessionStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(
        "moments_checkout_form",
        JSON.stringify({
          name,
          phone,
          email,
          deliveryMethod,
          town,
          address,
          landmark,
          notes,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [name, phone, email, deliveryMethod, town, address, landmark, notes, mounted]);

  // Update default payment method when delivery method changes
  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setPaymentMethod("pickup");
    } else {
      setPaymentMethod("delivery");
    }
  }, [deliveryMethod]);

  // Delivery fee calculation
  const selectedTownObj = towns.find((t) => t.name === town);
  const deliveryFee = deliveryMethod === "pickup" ? 0 : selectedTownObj ? selectedTownObj.fee : 500;
  const subtotal = totalPrice();
  const total = subtotal + deliveryFee;
  const hasUnavailable = items.some((i) => i.unavailable);

  function fieldError(field: string) {
    if (field === "name" && !name.trim()) return "Full name is required";
    if (field === "phone" && !normalizeKenyanPhone(phone)) return "Enter a valid Kenyan phone number";
    if (field === "town" && deliveryMethod === "courier" && !selectedTownObj) return "Please select a town or region";
    if (field === "address" && deliveryMethod === "courier" && !address.trim()) return "Delivery address is required";
    return "";
  }

  function handleBlur(field: string) {
    const message = fieldError(field);
    setTouched((previous) => ({ ...previous, [field]: true }));
    setErrors((previous) => ({ ...previous, [field]: message }));
  }

  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current || !catalogReady) return;
    setServerError(null);
    const fields = ["name", "phone", "town", "address"];
    const nextErrors = Object.fromEntries(fields.map((field) => [field, fieldError(field)]));
    setErrors(nextErrors);
    setTouched(Object.fromEntries(fields.map((field) => [field, true])));
    if (Object.values(nextErrors).some(Boolean)) return;

    if (items.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    const normalizedPhone = normalizeKenyanPhone(phone)!;
    submitting.current = true;
    setIsSubmitting(true);

    try {
      const order = {
        customerName: name,
        customerPhone: normalizedPhone,
        customerEmail: email || undefined,
        deliveryMethod,
        deliveryTown: deliveryMethod === "courier" ? town : undefined,
        deliveryAddress: deliveryMethod === "courier" ? address : undefined,
        deliveryLandmark: landmark || undefined,
        notes: notes || undefined,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          color: i.color,
          size: i.size,
          variantId: i.variantId,
          variantLabel: i.variantLabel,
        })),
      };
      const payload = JSON.stringify(order);
      if (!attempt.current) {
        try {
          attempt.current = JSON.parse(sessionStorage.getItem("moments_checkout_attempt") ?? "null") ?? undefined;
        } catch {
          // Checkout still works when session storage is unavailable.
        }
      }
      if (attempt.current?.payload !== payload || typeof attempt.current.key !== "string") {
        if (hasUnavailable) throw new Error("Remove unavailable items before placing an order.");
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        attempt.current = {
          payload,
          expectedTotal: total,
          key: Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""),
        };
        try {
          sessionStorage.setItem("moments_checkout_attempt", JSON.stringify(attempt.current));
        } catch {
          // The in-memory key still protects retries on this page.
        }
      }
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, idempotencyKey: attempt.current.key, expectedTotal: attempt.current.expectedTotal }),
      });

      if (response.status >= 400 && response.status < 500) {
        attempt.current = undefined;
        try {
          sessionStorage.removeItem("moments_checkout_attempt");
        } catch {
          // Checkout can continue without session storage.
        }
      }
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      // Clear form in sessionStorage
      try {
        sessionStorage.removeItem("moments_checkout_form");
        sessionStorage.removeItem("moments_checkout_attempt");
      } catch {
        // ignore
      }

      // Clear cart ONLY after order exists
      clearCart();

      // If redirectUrl from online provider is returned, navigate there; else to order confirmation
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push(`/order/${data.order.id}`);
      }
    } catch (err) {
      void refreshCatalog().then(syncWithCatalog).catch(console.error);
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-[#F6F4F0] min-h-[60vh] py-16 animate-pulse">
        <Container>
          <div className="h-8 w-36 bg-[#EDEAE4] rounded-[2px] mb-8" />
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#F6F4F0] min-h-[60vh] py-20 flex items-center justify-center">
        <Container className="text-center space-y-3">
          <h1 className="text-xl font-heading font-medium text-[#111111]">
            No items in checkout
          </h1>
          <p className="text-xs text-[#6B6B66]">
            Add items to your cart before proceeding to checkout.
          </p>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-[44px] px-6 rounded-[2px] bg-[#BB4C6C] text-white text-xs font-medium hover:bg-[#9A3E58] transition-colors"
            >
              Start shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F4F0] min-h-screen py-8 sm:py-12">
      <Container>
        <div className="mb-8 pb-4 border-b border-[#E4E0D8]">
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[#111111]">
            Checkout
          </h1>
        </div>

        {/* Mobile Collapsible Summary (closed by default with total visible) */}
        <div className="lg:hidden mb-6 rounded-[2px] border border-[#E4E0D8] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            aria-expanded={mobileSummaryOpen}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-[#111111]"
          >
            <div className="flex items-center gap-2">
              <span>{mobileSummaryOpen ? "Hide" : "Show"} order summary</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#6B6B66] transition-transform",
                  mobileSummaryOpen && "rotate-180"
                )}
              />
            </div>
            <Price amount={total} className="text-sm font-medium text-[#111111]" />
          </button>

          {mobileSummaryOpen && (
            <div className="p-4 border-t border-[#E4E0D8] bg-[#F6F4F0]/50 space-y-3 text-xs">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#6B6B66]">
                  <span className="truncate pr-2">
                    {item.quantity}x {cleanBrandName(item.name)}
                    {item.color ? ` (${item.color})` : ""}
                  </span>
                  <Price amount={item.price * item.quantity} className="text-[#111111] font-medium" />
                </div>
              ))}
              <div className="pt-2 border-t border-[#E4E0D8] flex justify-between">
                <span>Delivery</span>
                <span className="text-[#111111]">
                  {deliveryFee === 0 ? "Free" : `KES ${deliveryFee}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-[2px] bg-[#B3261E]/5 border border-[#B3261E]/20 text-xs text-[#B3261E]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT 7 COLUMNS: FORM STEPS */}
            <div className="lg:col-span-7 space-y-8">
              {/* SECTION 1: CONTACT */}
              <section className="space-y-4">
                <h2 className="text-base font-medium text-[#111111]">Contact</h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-xs font-medium text-[#111111] mb-1.5"
                    >
                      Full Name <span className="text-[#B3261E]">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      placeholder="e.g. Dennis Mwangi"
                      className={cn(
                        "w-full h-[48px] px-3 rounded-[2px] border bg-white text-xs text-[#111111] placeholder:text-[#6B6B66]/60 outline-none transition-colors",
                        errors.name
                          ? "border-[#B3261E] focus:ring-1 focus:ring-[#B3261E]"
                          : "border-[#E4E0D8] focus:border-[#111111]"
                      )}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-[#B3261E] mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="customerPhone"
                      className="block text-xs font-medium text-[#111111] mb-1.5"
                    >
                      Phone Number <span className="text-[#B3261E]">*</span>
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      placeholder="0712 345 678 or 0110 123 456"
                      className={cn(
                        "w-full h-[48px] px-3 rounded-[2px] border bg-white text-xs text-[#111111] placeholder:text-[#6B6B66]/60 outline-none transition-colors",
                        errors.phone
                          ? "border-[#B3261E] focus:ring-1 focus:ring-[#B3261E]"
                          : "border-[#E4E0D8] focus:border-[#111111]"
                      )}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-xs text-[#B3261E] mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="block text-xs font-medium text-[#111111] mb-1.5"
                    >
                      Email <span className="text-[#6B6B66] font-normal">(optional for receipt)</span>
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dennis@example.com"
                      className="w-full h-[48px] px-3 rounded-[2px] border border-[#E4E0D8] bg-white text-xs text-[#111111] placeholder:text-[#6B6B66]/60 outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: DELIVERY METHOD */}
              <section className="pt-6 border-t border-[#E4E0D8]">
                <DeliveryMethod
                  towns={towns}
                  method={deliveryMethod}
                  onChangeMethod={setDeliveryMethod}
                  town={town}
                  onChangeTown={setTown}
                  address={address}
                  onChangeAddress={setAddress}
                  landmark={landmark}
                  onChangeLandmark={setLandmark}
                  notes={notes}
                  onChangeNotes={setNotes}
                  errors={errors}
                  onBlur={handleBlur}
                />
              </section>

              {/* SECTION 3: PAYMENT METHOD */}
              <section className="pt-6 border-t border-[#E4E0D8]">
                <PaymentMethod
                  deliveryMethod={deliveryMethod}
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                />
              </section>
            </div>

            {/* RIGHT 5 COLUMNS: ORDER SUMMARY & SUBMIT */}
            <div className="lg:col-span-5 lg:sticky lg:top-[88px] space-y-4">
              <div className="rounded-[2px] border border-[#E4E0D8] bg-white p-5 sm:p-6 space-y-5">
                <h2 className="text-base font-medium text-[#111111] pb-3 border-b border-[#E4E0D8]">
                  Order summary
                </h2>

                {/* Line Items List */}
                <div className="space-y-3 divide-y divide-[#E4E0D8] max-h-60 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 flex justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-[#111111] truncate">
                          {cleanBrandName(item.name)}
                        </p>
                        <p className="text-[#6B6B66]">
                          Qty: {item.quantity}
                          {item.color ? ` / ${item.color}` : ""}
                          {item.size ? ` / Size ${item.size}` : ""}
                        </p>
                      </div>
                      <Price
                        amount={item.price * item.quantity}
                        className="text-[#111111] font-medium shrink-0"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-xs pt-4 border-t border-[#E4E0D8]">
                  <div className="flex justify-between text-[#6B6B66]">
                    <span>Subtotal</span>
                    <Price amount={subtotal} className="text-[#111111] font-medium" />
                  </div>

                  <div className="flex justify-between text-[#6B6B66]">
                    <span>
                      Delivery ({deliveryMethod === "pickup" ? "Pickup" : town || "Courier"})
                    </span>
                    <span className="text-[#111111]">
                      {deliveryFee === 0 ? "Free" : `KES ${deliveryFee.toLocaleString("en-KE")}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#E4E0D8] flex justify-between text-base font-medium text-[#111111]">
                    <span>Total</span>
                    <Price amount={total} className="text-lg font-medium text-[#111111]" />
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={!catalogReady || isSubmitting}
                  className={cn(
                    "w-full h-[52px] rounded-[2px] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors select-none cursor-pointer",
                    !catalogReady || isSubmitting
                      ? "bg-[#E4E0D8] text-[#6B6B66] cursor-not-allowed pointer-events-none"
                      : "bg-[#BB4C6C] hover:bg-[#9A3E58] active:translate-y-[1px]"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing order...</span>
                    </>
                  ) : (
                    <span>Place order, KES {total.toLocaleString("en-KE")}</span>
                  )}
                </button>

                <p className="text-[11px] text-[#6B6B66] text-center">
                  Order status is verified directly by our shop team.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
