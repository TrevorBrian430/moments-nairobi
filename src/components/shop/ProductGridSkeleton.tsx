import React from "react";

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 w-full">
          {/* 4:5 Image placeholder with 1.5s slow opacity pulse */}
          <div className="relative aspect-[4/5] w-full rounded-[2px] bg-[var(--color-surface-fallback)] animate-pulse" />

          {/* Info placeholders */}
          <div className="space-y-2 pt-1">
            <div className="h-4 w-3/4 rounded-[2px] bg-[var(--color-surface-fallback)] animate-pulse" />
            <div className="h-4 w-1/3 rounded-[2px] bg-[var(--color-surface-fallback)] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
