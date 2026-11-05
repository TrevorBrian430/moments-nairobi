"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, Product } from "@/lib/constants";
import { ShopFilterParams } from "@/lib/shop-params";
import { cn } from "@/lib/utils";

export interface FilterRailProps {
  params: ShopFilterParams;
  allProducts: Product[];
  onFilterChange: (newParams: Partial<ShopFilterParams>) => void;
  onClearAll: () => void;
  className?: string;
}

const COLOR_OPTIONS: { name: string; hex: string }[] = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "Brown", hex: "#4a3728" },
  { name: "Maroon", hex: "#8b3a4a" },
  { name: "Blue", hex: "#1e56a0" },
  { name: "Green", hex: "#2d7d46" },
  { name: "Grey", hex: "#808080" },
  { name: "Khaki", hex: "#c4a882" },
];

export function FilterRail({
  params,
  allProducts,
  onFilterChange,
  onClearAll,
  className,
}: FilterRailProps) {
  // Accordions open by default
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);

  // Local state for debounced/blur price inputs
  const [localMin, setLocalMin] = useState<string>(
    params.min ? String(params.min) : ""
  );
  const [localMax, setLocalMax] = useState<string>(
    params.max ? String(params.max) : ""
  );

  useEffect(() => {
    setLocalMin(params.min ? String(params.min) : "");
  }, [params.min]);

  useEffect(() => {
    setLocalMax(params.max ? String(params.max) : "");
  }, [params.max]);

  // Compute category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    counts["all"] = allProducts.length;
    for (const cat of CATEGORIES) {
      counts[cat.slug] = allProducts.filter((p) => p.category === cat.slug).length;
    }
    return counts;
  }, [allProducts]);

  // Extract available sizes from all products
  const availableSizes = React.useMemo(() => {
    const sizes = new Set<string>();
    for (const p of allProducts) {
      if (p.sizes) {
        for (const s of p.sizes) sizes.add(s);
      }
    }
    return Array.from(sizes);
  }, [allProducts]);

  const hasActiveFilters = Boolean(
    (params.category && params.category !== "all") ||
      params.min ||
      params.max ||
      (params.color && params.color.length > 0) ||
      (params.size && params.size.length > 0)
  );

  const applyPrices = () => {
    const minVal = localMin ? Number(localMin) : undefined;
    const maxVal = localMax ? Number(localMax) : undefined;
    onFilterChange({
      min: minVal && !isNaN(minVal) ? minVal : undefined,
      max: maxVal && !isNaN(maxVal) ? maxVal : undefined,
    });
  };

  const toggleColor = (colorName: string) => {
    const lower = colorName.toLowerCase();
    const current = params.color || [];
    const next = current.includes(lower)
      ? current.filter((c) => c !== lower)
      : [...current, lower];
    onFilterChange({ color: next.length > 0 ? next : undefined });
  };

  const toggleSize = (sizeName: string) => {
    const current = params.size || [];
    const next = current.includes(sizeName)
      ? current.filter((s) => s !== sizeName)
      : [...current, sizeName];
    onFilterChange({ size: next.length > 0 ? next : undefined });
  };

  return (
    <aside
      className={cn("w-full lg:w-[260px] shrink-0 space-y-6 text-left", className)}
      aria-label="Product filters"
    >
      {/* Rail top bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
        <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--color-muted)]">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)] underline underline-offset-4 cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Accordion 1: Category */}
      <div className="border-b border-[var(--color-hairline)] pb-5">
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          aria-expanded={categoryOpen}
          className="w-full flex items-center justify-between py-1 text-sm font-medium text-[var(--color-ink)] cursor-pointer select-none"
        >
          <span>Category</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
              categoryOpen && "rotate-180"
            )}
          />
        </button>

        {categoryOpen && (
          <ul className="mt-3 space-y-2 text-sm" role="list">
            <li>
              <button
                type="button"
                onClick={() => onFilterChange({ category: undefined })}
                className={cn(
                  "w-full flex items-center justify-between py-1.5 transition-colors cursor-pointer text-left text-xs sm:text-sm",
                  !params.category || params.category === "all"
                    ? "border-l-2 border-[var(--color-accent)] pl-2.5 text-[var(--color-ink)] font-medium"
                    : "border-l-2 border-transparent pl-3 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                <span>All products</span>
                <span className="text-xs text-[var(--color-muted)]">
                  {categoryCounts["all"]}
                </span>
              </button>
            </li>
            {CATEGORIES.map((cat) => {
              const isSelected = params.category === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => onFilterChange({ category: cat.slug })}
                    className={cn(
                      "w-full flex items-center justify-between py-1.5 transition-colors cursor-pointer text-left text-xs sm:text-sm",
                      isSelected
                        ? "border-l-2 border-[var(--color-accent)] pl-2.5 text-[var(--color-ink)] font-medium"
                        : "border-l-2 border-transparent pl-3 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {categoryCounts[cat.slug] || 0}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Accordion 2: Price */}
      <div className="border-b border-[var(--color-hairline)] pb-5">
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          aria-expanded={priceOpen}
          className="w-full flex items-center justify-between py-1 text-sm font-medium text-[var(--color-ink)] cursor-pointer select-none"
        >
          <span>Price (KES)</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
              priceOpen && "rotate-180"
            )}
          />
        </button>

        {priceOpen && (
          <div className="mt-3 space-y-3">
            {/* Two number inputs: min, max */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-muted)] pointer-events-none">
                  KES
                </span>
                <input
                  type="number"
                  aria-label="Minimum price in KES"
                  placeholder="Min"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onBlur={applyPrices}
                  onKeyDown={(e) => e.key === "Enter" && applyPrices()}
                  className="w-full pl-9 pr-2 py-2 text-xs bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] min-h-[44px] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                />
              </div>
              <span className="text-xs text-[var(--color-muted)]">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-muted)] pointer-events-none">
                  KES
                </span>
                <input
                  type="number"
                  aria-label="Maximum price in KES"
                  placeholder="Max"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onBlur={applyPrices}
                  onKeyDown={(e) => e.key === "Enter" && applyPrices()}
                  className="w-full pl-9 pr-2 py-2 text-xs bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] min-h-[44px] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {/* Presets: Under 2,000 / 2,000 to 4,000 / Above 4,000 */}
            <div className="space-y-1 pt-1">
              {[
                { label: "Under 2,000", min: undefined, max: 2000 },
                { label: "2,000 to 4,000", min: 2000, max: 4000 },
                { label: "Above 4,000", min: 4000, max: undefined },
              ].map((preset) => {
                const isActive =
                  params.min === preset.min && params.max === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      onFilterChange({ min: preset.min, max: preset.max })
                    }
                    className={cn(
                      "w-full text-left py-1 text-xs transition-colors cursor-pointer",
                      isActive
                        ? "text-[var(--color-accent)] font-medium"
                        : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Color */}
      <div className="border-b border-[var(--color-hairline)] pb-5">
        <button
          type="button"
          onClick={() => setColorOpen(!colorOpen)}
          aria-expanded={colorOpen}
          className="w-full flex items-center justify-between py-1 text-sm font-medium text-[var(--color-ink)] cursor-pointer select-none"
        >
          <span>Color</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
              colorOpen && "rotate-180"
            )}
          />
        </button>

        {colorOpen && (
          <div className="mt-3 flex flex-wrap gap-2.5 pt-1">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = params.color?.includes(c.name.toLowerCase());
              return (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  aria-label={`Filter by color ${c.name}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleColor(c.name)}
                  className={cn(
                    "h-5 w-5 rounded-full border border-[var(--color-hairline)] transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                    isSelected &&
                      "ring-2 ring-offset-2 ring-[var(--color-accent)] scale-110"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 4: Size (rendered only because size data exists in products) */}
      {availableSizes.length > 0 && (
        <div className="border-b border-[var(--color-hairline)] pb-5">
          <button
            type="button"
            onClick={() => setSizeOpen(!sizeOpen)}
            aria-expanded={sizeOpen}
            className="w-full flex items-center justify-between py-1 text-sm font-medium text-[var(--color-ink)] cursor-pointer select-none"
          >
            <span>Size</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
                sizeOpen && "rotate-180"
              )}
            />
          </button>

          {sizeOpen && (
            <div className="mt-3 flex flex-wrap gap-2 pt-1">
              {availableSizes.map((sz) => {
                const isSelected = params.size?.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    aria-label={`Filter by size ${sz}`}
                    aria-pressed={isSelected}
                    onClick={() => toggleSize(sz)}
                    className={cn(
                      "px-3 py-2 text-xs font-medium rounded-[2px] border transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                      isSelected
                        ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                        : "bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-hairline)] hover:border-[var(--color-ink)]"
                    )}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default FilterRail;
