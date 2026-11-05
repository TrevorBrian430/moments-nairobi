import React from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { ShopFilterParams } from "@/lib/shop-params";

export interface ActiveFilterChipsProps {
  params: ShopFilterParams;
  onRemoveCategory: () => void;
  onRemovePrice: () => void;
  onRemoveColor: (color: string) => void;
  onRemoveSize: (size: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  params,
  onRemoveCategory,
  onRemovePrice,
  onRemoveColor,
  onRemoveSize,
  onClearAll,
}: ActiveFilterChipsProps) {
  const categoryInfo = params.category
    ? CATEGORIES.find((c) => c.slug === params.category)
    : null;

  const hasPrice = typeof params.min === "number" || typeof params.max === "number";
  const hasColors = params.color && params.color.length > 0;
  const hasSizes = params.size && params.size.length > 0;
  const hasCategory = Boolean(params.category && params.category !== "all");

  const totalActive =
    (hasCategory ? 1 : 0) +
    (hasPrice ? 1 : 0) +
    (params.color?.length || 0) +
    (params.size?.length || 0);

  if (totalActive === 0) {
    return null;
  }

  const formatPriceLabel = () => {
    if (params.min && params.max) {
      return `KES ${params.min.toLocaleString()} - ${params.max.toLocaleString()}`;
    }
    if (params.max) {
      return `Under KES ${params.max.toLocaleString()}`;
    }
    if (params.min) {
      return `Above KES ${params.min.toLocaleString()}`;
    }
    return "Price";
  };

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide select-none"
      aria-label="Active filters"
    >
      {/* Category chip */}
      {hasCategory && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] shrink-0">
          <span>{categoryInfo?.name || params.category}</span>
          <button
            type="button"
            onClick={onRemoveCategory}
            aria-label={`Remove category filter ${categoryInfo?.name || params.category}`}
            className="p-0.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Price chip */}
      {hasPrice && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] shrink-0">
          <span>{formatPriceLabel()}</span>
          <button
            type="button"
            onClick={onRemovePrice}
            aria-label="Remove price filter"
            className="p-0.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Color chips */}
      {params.color?.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] shrink-0 capitalize"
        >
          <span>{c}</span>
          <button
            type="button"
            onClick={() => onRemoveColor(c)}
            aria-label={`Remove color filter ${c}`}
            className="p-0.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Size chips */}
      {params.size?.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] shrink-0 uppercase"
        >
          <span>{s}</span>
          <button
            type="button"
            onClick={() => onRemoveSize(s)}
            aria-label={`Remove size filter ${s}`}
            className="p-0.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Clear all text link */}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)] underline underline-offset-4 px-2 py-1 shrink-0 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
}

export default ActiveFilterChips;
