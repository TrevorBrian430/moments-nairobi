"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES, type Product } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, Filter, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price-asc" | "price-desc";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceMax, setPriceMax] = useState<number>(6000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      // Price filter
      const effPrice = p.salePrice ?? p.price;
      if (effPrice > priceMax) {
        return false;
      }
      // In stock
      if (onlyInStock && !p.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      // Newest
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [selectedCategory, sortBy, priceMax, onlyInStock]);

  const currentCategoryInfo = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-hidden">
      {/* Header section */}
      <div className="border-b border-gray-100 pb-8 mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 capitalize">
          {selectedCategory === "all" ? "All Collections" : currentCategoryInfo?.name || selectedCategory.replace("-", " ")}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {currentCategoryInfo?.description || "Explore everyday fits, designer backpacks & versatile accessories."}
        </p>

        {/* Quick category pills on desktop & mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-4 scrollbar-hide">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
              selectedCategory === "all"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            All Products ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
                  selectedCategory === cat.slug
                    ? "bg-[#B85C6E] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                <SlidersHorizontal className="h-4 w-4 text-[#B85C6E]" />
                Filters
              </h3>
              {(selectedCategory !== "all" || priceMax < 6000 || onlyInStock) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceMax(6000);
                    setOnlyInStock(false);
                  }}
                  className="text-xs text-[#B85C6E] hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Price slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Max Price
                </span>
                <span className="text-sm font-bold text-gray-900">
                  KES {priceMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#B85C6E] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>KES 1,000</span>
                <span>KES 6,000</span>
              </div>
            </div>

            {/* In stock only toggle */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#B85C6E] focus:ring-[#B85C6E] accent-[#B85C6E]"
                />
                <span className="text-sm text-gray-700 font-medium">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>

          {/* Location box */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-gray-100 text-xs text-gray-600 space-y-2">
            <div className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              📍 Store Pickup Available
            </div>
            <p>
              Twilight Suites F4-08, Tom Mboya St. Select items can be reserved online &amp; paid at pickup.
            </p>
          </div>
        </aside>

        {/* Product listing main area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm"
              >
                <Filter className="h-4 w-4 text-[#B85C6E]" />
                Filters
              </button>
              <span className="text-xs sm:text-sm text-gray-600">
                Showing <strong className="text-gray-900">{filteredProducts.length}</strong> items
              </span>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#B85C6E]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-8 space-y-3">
              <p className="text-gray-500 font-medium">
                No items match your selected filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceMax(6000);
                  setOnlyInStock(false);
                }}
                className="text-sm font-semibold text-[#B85C6E] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter bottom drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 lg:hidden">
          <div className="bg-white rounded-t-3xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium",
                    selectedCategory === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium",
                      selectedCategory === cat.slug
                        ? "bg-[#B85C6E] text-white"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Max Price
                </span>
                <span className="text-sm font-bold text-gray-900">
                  KES {priceMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#B85C6E]"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-full text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
