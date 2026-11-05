"use client";

import React from "react";
import { POLICIES, DeliveryTown } from "@/config/policies";
import { STORE_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface DeliveryMethodProps {
  method: "pickup" | "courier";
  onChangeMethod: (method: "pickup" | "courier") => void;
  town: string;
  onChangeTown: (town: string) => void;
  address: string;
  onChangeAddress: (address: string) => void;
  landmark: string;
  onChangeLandmark: (landmark: string) => void;
  notes: string;
  onChangeNotes: (notes: string) => void;
  errors: Record<string, string>;
  onBlur: (field: string) => void;
}

export function DeliveryMethod({
  method,
  onChangeMethod,
  town,
  onChangeTown,
  address,
  onChangeAddress,
  landmark,
  onChangeLandmark,
  notes,
  onChangeNotes,
  errors,
  onBlur,
}: DeliveryMethodProps) {
  const towns = POLICIES.delivery.towns;
  const currentTownObj = towns.find((t) => t.name === town);
  const courierFee = currentTownObj ? currentTownObj.fee : 500;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-[#111111]">Delivery method</h2>

      {/* Radio options */}
      <div className="space-y-3" role="radiogroup" aria-label="Delivery options">
        {/* Option 1: Store Pickup */}
        <label
          className={cn(
            "flex items-start gap-3 p-4 rounded-[2px] border transition-colors cursor-pointer select-none",
            method === "pickup"
              ? "border-[#111111] bg-white ring-1 ring-[#111111]"
              : "border-[#E4E0D8] bg-white hover:border-[#6B6B66]"
          )}
        >
          <input
            type="radio"
            name="deliveryMethod"
            value="pickup"
            checked={method === "pickup"}
            onChange={() => onChangeMethod("pickup")}
            className="mt-1 h-4 w-4 text-[#BB4C6C] border-[#E4E0D8] focus:ring-[#BB4C6C]"
          />
          <div className="flex-1 text-xs leading-relaxed">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-[#111111]">
                Pick up at Twilight Suites F4-08
              </span>
              <span className="text-xs font-medium text-[#1FA855]">Free</span>
            </div>
            <p className="text-[#6B6B66] mt-0.5">
              Ready in about 1 hour. Tom Mboya Street, Nairobi CBD.
            </p>
            <p className="text-[#6B6B66] mt-0.5">
              Open {STORE_HOURS.weekdays}; {STORE_HOURS.saturday}.
            </p>
          </div>
        </label>

        {/* Option 2: Courier */}
        <label
          className={cn(
            "flex items-start gap-3 p-4 rounded-[2px] border transition-colors cursor-pointer select-none",
            method === "courier"
              ? "border-[#111111] bg-white ring-1 ring-[#111111]"
              : "border-[#E4E0D8] bg-white hover:border-[#6B6B66]"
          )}
        >
          <input
            type="radio"
            name="deliveryMethod"
            value="courier"
            checked={method === "courier"}
            onChange={() => onChangeMethod("courier")}
            className="mt-1 h-4 w-4 text-[#BB4C6C] border-[#E4E0D8] focus:ring-[#BB4C6C]"
          />
          <div className="flex-1 text-xs leading-relaxed">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-[#111111]">
                Courier dispatch
              </span>
              <span className="text-xs font-medium text-[#111111]">
                {town
                  ? courierFee === 0
                    ? "Free"
                    : `KES ${courierFee.toLocaleString("en-KE")}`
                  : "KES 300 to 500"}
              </span>
            </div>
            <p className="text-[#6B6B66] mt-0.5">
              Delivered within 24 hours via reliable courier partners across Kenya.
            </p>
          </div>
        </label>
      </div>

      {/* Courier Address Fields */}
      {method === "courier" && (
        <div className="space-y-4 pt-2 border-t border-[#E4E0D8] animate-fade-in">
          {/* Town / City Select */}
          <div>
            <label
              htmlFor="deliveryTown"
              className="block text-xs font-medium text-[#111111] mb-1.5"
            >
              Town / Region <span className="text-[#B3261E]">*</span>
            </label>
            <select
              id="deliveryTown"
              value={town}
              onChange={(e) => onChangeTown(e.target.value)}
              onBlur={() => onBlur("town")}
              aria-describedby={errors.town ? "town-error" : undefined}
              className={cn(
                "w-full h-[48px] px-3 rounded-[2px] border bg-white text-xs text-[#111111] outline-none transition-colors",
                errors.town
                  ? "border-[#B3261E] focus:ring-1 focus:ring-[#B3261E]"
                  : "border-[#E4E0D8] focus:border-[#111111]"
              )}
            >
              <option value="">Select your town / region</option>
              {towns.map((t: DeliveryTown) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.fee === 0 ? "Free CBD" : `KES ${t.fee}`})
                </option>
              ))}
            </select>
            {errors.town && (
              <p id="town-error" className="text-xs text-[#B3261E] mt-1">
                {errors.town}
              </p>
            )}
          </div>

          {/* Area / Estate / Street */}
          <div>
            <label
              htmlFor="deliveryAddress"
              className="block text-xs font-medium text-[#111111] mb-1.5"
            >
              Area, Estate or Street Address <span className="text-[#B3261E]">*</span>
            </label>
            <input
              id="deliveryAddress"
              type="text"
              autoComplete="address-line1"
              value={address}
              onChange={(e) => onChangeAddress(e.target.value)}
              onBlur={() => onBlur("address")}
              aria-describedby={errors.address ? "address-error" : undefined}
              placeholder="e.g. Kilimani, Wood Avenue, Apex Court Apt 4B"
              className={cn(
                "w-full h-[48px] px-3 rounded-[2px] border bg-white text-xs text-[#111111] placeholder:text-[#6B6B66]/60 outline-none transition-colors",
                errors.address
                  ? "border-[#B3261E] focus:ring-1 focus:ring-[#B3261E]"
                  : "border-[#E4E0D8] focus:border-[#111111]"
              )}
            />
            {errors.address && (
              <p id="address-error" className="text-xs text-[#B3261E] mt-1">
                {errors.address}
              </p>
            )}
          </div>

          {/* Landmark */}
          <div>
            <label
              htmlFor="deliveryLandmark"
              className="block text-xs font-medium text-[#111111] mb-1.5"
            >
              Nearby Landmark <span className="text-[#6B6B66] font-normal">(optional)</span>
            </label>
            <input
              id="deliveryLandmark"
              type="text"
              value={landmark}
              onChange={(e) => onChangeLandmark(e.target.value)}
              placeholder="e.g. Near Yaya Centre or QuickMart"
              className="w-full h-[48px] px-3 rounded-[2px] border border-[#E4E0D8] bg-white text-xs text-[#111111] placeholder:text-[#6B6B66]/60 outline-none focus:border-[#111111] transition-colors"
            />
          </div>

          {/* Delivery Notes */}
          <div>
            <label
              htmlFor="deliveryNotes"
              className="block text-xs font-medium text-[#111111] mb-1.5"
            >
              Delivery Notes <span className="text-[#6B6B66] font-normal">(optional)</span>
            </label>
            <textarea
              id="deliveryNotes"
              rows={2}
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="Special instructions or preferred drop-off time..."
              className="w-full p-3 rounded-[2px] border border-[#E4E0D8] bg-white text-xs text-[#111111] placeholder:text-[#6B6B66]/60 outline-none focus:border-[#111111] transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
