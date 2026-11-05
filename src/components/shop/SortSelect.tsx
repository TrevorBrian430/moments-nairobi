import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortValue = "newest" | "price-asc" | "price-desc";

export interface SortSelectProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
  className?: string;
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <label htmlFor="sort-select" className="sr-only">
        Sort products by
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
        className="appearance-none bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-normal text-[var(--color-ink)] min-h-[44px] cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
    </div>
  );
}

export default SortSelect;
