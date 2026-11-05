"use client";

import React from "react";
import { POLICIES } from "@/config/policies";
import { cn } from "@/lib/utils";

export interface PaymentMethodProps {
  deliveryMethod: "pickup" | "courier";
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export function PaymentMethod({
  deliveryMethod,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodProps) {
  const showPayOnPickup = deliveryMethod === "pickup" && POLICIES.payments.payOnPickup;
  const showPayOnDelivery = deliveryMethod === "courier" && POLICIES.payments.payOnDelivery;
  const showPayOnline = POLICIES.payments.payOnline;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-[#111111]">Payment</h2>

      <div className="space-y-3" role="radiogroup" aria-label="Payment options">
        {/* Pay on Pickup */}
        {showPayOnPickup && (
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-[2px] border transition-colors cursor-pointer select-none",
              selectedMethod === "pickup"
                ? "border-[#111111] bg-white ring-1 ring-[#111111]"
                : "border-[#E4E0D8] bg-white hover:border-[#6B6B66]"
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="pickup"
              checked={selectedMethod === "pickup"}
              onChange={() => onSelectMethod("pickup")}
              className="mt-1 h-4 w-4 text-[#BB4C6C] border-[#E4E0D8] focus:ring-[#BB4C6C]"
            />
            <div className="flex-1 text-xs leading-relaxed">
              <span className="text-sm font-medium text-[#111111]">
                Pay on pickup
              </span>
              <p className="text-[#6B6B66] mt-0.5">
                Pay via M-Pesa or cash when you collect your order at Twilight Suites.
              </p>
            </div>
          </label>
        )}

        {/* Pay on Delivery */}
        {showPayOnDelivery && (
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-[2px] border transition-colors cursor-pointer select-none",
              selectedMethod === "delivery"
                ? "border-[#111111] bg-white ring-1 ring-[#111111]"
                : "border-[#E4E0D8] bg-white hover:border-[#6B6B66]"
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="delivery"
              checked={selectedMethod === "delivery"}
              onChange={() => onSelectMethod("delivery")}
              className="mt-1 h-4 w-4 text-[#BB4C6C] border-[#E4E0D8] focus:ring-[#BB4C6C]"
            />
            <div className="flex-1 text-xs leading-relaxed">
              <span className="text-sm font-medium text-[#111111]">
                Pay on delivery
              </span>
              <p className="text-[#6B6B66] mt-0.5">
                Pay via M-Pesa upon parcel handover with courier confirmation.
              </p>
            </div>
          </label>
        )}

        {/* Pay Online (Shown only when provider is configured) */}
        {showPayOnline && (
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-[2px] border transition-colors cursor-pointer select-none",
              selectedMethod === "online"
                ? "border-[#111111] bg-white ring-1 ring-[#111111]"
                : "border-[#E4E0D8] bg-white hover:border-[#6B6B66]"
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={selectedMethod === "online"}
              onChange={() => onSelectMethod("online")}
              className="mt-1 h-4 w-4 text-[#BB4C6C] border-[#E4E0D8] focus:ring-[#BB4C6C]"
            />
            <div className="flex-1 text-xs leading-relaxed">
              <span className="text-sm font-medium text-[#111111]">
                Pay online
              </span>
              <p className="text-[#6B6B66] mt-0.5">
                Secure checkout via card or M-Pesa.
              </p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
