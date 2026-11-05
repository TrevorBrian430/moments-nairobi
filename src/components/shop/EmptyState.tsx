import React from "react";
import { Product } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";

export interface EmptyStateProps {
  onClear: () => void;
  suggestions: Product[];
}

export function EmptyState({ onClear, suggestions }: EmptyStateProps) {
  return (
    <div className="w-full py-12 space-y-12 text-left">
      {/* Empty message & action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
        <p className="text-sm text-[var(--color-muted)]">
          No products match these filters.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClear}
          className="min-h-[44px] px-5 w-full sm:w-auto self-start sm:self-auto"
        >
          Clear filters
        </Button>
      </div>

      {/* 4 suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-heading font-medium text-base text-[var(--color-ink)]">
            Suggested products
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {suggestions.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
