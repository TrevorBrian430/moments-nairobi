"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export interface VariantSelectorProps {
  colors?: ColorVariant[];
  selectedColor?: string;
  onSelectColor: (color: ColorVariant) => void;
  sizes?: string[];
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

export function VariantSelector({
  colors,
  selectedColor,
  onSelectColor,
  sizes,
  selectedSize,
  onSelectSize,
}: VariantSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Color Selector */}
      {colors && colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B6B66]">
              Color:{" "}
              <span className="text-[#111111] font-medium">
                {selectedColor || colors[0]?.name}
              </span>
            </span>
          </div>

          <div
            className="flex flex-wrap items-center gap-3"
            role="group"
            aria-label="Color options"
          >
            {colors.map((color) => {
              const isSelected = selectedColor === color.name;
              const isOutOfStock = color.inStock === false;

              return (
                <button
                  key={color.name}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onSelectColor(color)}
                  aria-pressed={isSelected}
                  aria-label={`Select color ${color.name}${
                    isOutOfStock ? " (Out of stock)" : ""
                  }`}
                  title={`${color.name}${isOutOfStock ? " - Out of stock" : ""}`}
                  className={cn(
                    "relative w-6 h-6 rounded-full transition-all cursor-pointer flex items-center justify-center border border-black/15",
                    isSelected && "ring-1 ring-[#111111] ring-offset-2",
                    isOutOfStock &&
                      "opacity-40 cursor-not-allowed pointer-events-none"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isOutOfStock && (
                    <span className="absolute inset-x-0 h-[1.5px] bg-[#111111] rotate-45 transform" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector (only shown if size data exists) */}
      {sizes && sizes.length > 0 && onSelectSize && (
        <div className="space-y-2">
          <div className="text-xs text-[#6B6B66]">
            Size:{" "}
            <span className="text-[#111111] font-medium">
              {selectedSize || sizes[0]}
            </span>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Size options"
          >
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  aria-pressed={isSelected}
                  aria-label={`Select size ${size}`}
                  className={cn(
                    "min-w-[44px] h-[44px] px-3 rounded-[2px] border text-xs font-medium transition-colors cursor-pointer touch-manipulation",
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-[#111111] border-[#E4E0D8] hover:border-[#6B6B66]"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
