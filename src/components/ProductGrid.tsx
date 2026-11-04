"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
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
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <section className="w-full">
      {/* 1. Title bar */}
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-[#B85C6E] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Compact filter bar: Categories + Sort dropdown in one line */}
      {showFilters && (
        <div className="mb-6 flex items-center justify-between gap-3 bg-gray-50/80 p-2 sm:p-2.5 rounded-2xl border border-gray-100">
          {/* Horizontal scrollable category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5 pr-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                activeCategory === "all"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
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
                  "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                  activeCategory === cat.slug
                    ? "bg-[#B85C6E] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Compact Sort dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={cn(
                "appearance-none rounded-xl border border-gray-200 bg-white py-1.5 pl-3 pr-7 text-xs font-bold text-gray-700",
                "focus:border-[#B85C6E] focus:outline-none shadow-sm cursor-pointer"
              )}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      )}

      {/* 3. Product grid (2-col mobile, 3-col tablet, 4-col desktop) */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center bg-gray-50/50">
          <p className="text-sm font-medium text-gray-500">
            No products found in this category.
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className="mt-2 text-xs font-bold text-[#B85C6E] hover:underline"
          >
            View all products
          </button>
        </div>
      )}
    </section>
  );
}
