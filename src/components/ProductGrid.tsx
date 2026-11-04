"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Product } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";

type SortOption = "newest" | "price-asc" | "price-desc";

interface ProductGridProps {
  products: Product[];
  title?: string;
  showFilters?: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export default function ProductGrid({
  products,
  title,
  showFilters = false,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSorted = useMemo(() => {
    let result =
      activeCategory === "all"
        ? [...products]
        : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
        );
        break;
      case "newest":
      default:
        // New items first, then maintain original order
        result.sort(
          (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        );
        break;
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <section className="w-full">
      {/* Header */}
      {(title || showFilters) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {title && (
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                {title}
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-[#B85C6E] hover:underline sm:hidden"
              >
                View All
              </Link>
            </div>
          )}

          {showFilters && (
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={cn(
                    "appearance-none rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700",
                    "focus:border-[#B85C6E] focus:outline-none focus:ring-1 focus:ring-[#B85C6E]"
                  )}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
          )}

          {title && (
            <Link
              href="/shop"
              className="hidden text-sm font-medium text-[#B85C6E] hover:underline sm:inline-block"
            >
              View All →
            </Link>
          )}
        </div>
      )}

      {/* Category filter tabs */}
      {showFilters && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeCategory === cat.slug
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">No products found in this category.</p>
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className="mt-2 text-sm font-medium text-[#B85C6E] hover:underline"
          >
            View all products
          </button>
        </div>
      )}
    </section>
  );
}
