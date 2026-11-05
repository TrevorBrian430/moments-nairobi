"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantityStepper({
  quantity,
  onChange,
  max = 10,
  disabled = false,
  className,
}: QuantityStepperProps) {
  const canDecrease = quantity > 1 && !disabled;
  const canIncrease = quantity < max && !disabled;

  return (
    <div
      className={cn(
        "inline-flex items-center h-[44px] rounded-[2px] border border-[#E4E0D8] bg-white text-[#111111]",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
        className="w-[44px] h-[44px] flex items-center justify-center text-[#6B6B66] hover:text-[#111111] disabled:opacity-30 disabled:hover:text-[#6B6B66] transition-colors cursor-pointer touch-manipulation"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span
        className="w-10 text-center text-sm font-medium select-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={!canIncrease}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        aria-label="Increase quantity"
        className="w-[44px] h-[44px] flex items-center justify-center text-[#6B6B66] hover:text-[#111111] disabled:opacity-30 disabled:hover:text-[#6B6B66] transition-colors cursor-pointer touch-manipulation"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
