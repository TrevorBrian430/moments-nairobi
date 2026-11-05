"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Product } from "@/lib/constants";
import { ShopFilterParams } from "@/lib/shop-params";
import { FilterRail } from "./FilterRail";
import { Button } from "@/components/ui/Button";

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  params: ShopFilterParams;
  allProducts: Product[];
  onFilterChange: (newParams: Partial<ShopFilterParams>) => void;
  onClearAll: () => void;
  totalResults: number;
}

export function FilterDrawer({
  open,
  onClose,
  params,
  allProducts,
  onFilterChange,
  onClearAll,
  totalResults,
}: FilterDrawerProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter products"
      className="fixed inset-0 z-[70] lg:hidden flex flex-col justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Panel */}
      <div className="relative z-10 w-full max-h-[85vh] bg-[var(--color-surface)] border-t border-[var(--color-hairline)] rounded-t-[2px] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline)] bg-[var(--color-background)]">
          <span className="font-heading font-medium text-base text-[var(--color-ink)]">
            Filters
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filter drawer"
            className="p-2 -mr-2 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-5">
          <FilterRail
            params={params}
            allProducts={allProducts}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
        </div>

        {/* Sticky Drawer Footer with Apply and Clear */}
        <div className="border-t border-[var(--color-hairline)] p-4 bg-[var(--color-surface)] flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClearAll}
            className="flex-1 min-h-[48px]"
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="flex-2 min-h-[48px]"
          >
            Apply ({totalResults})
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FilterDrawer;
