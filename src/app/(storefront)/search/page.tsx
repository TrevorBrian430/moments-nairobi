"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import { Search as SearchIcon, X } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;

    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFeatures = p.features.some((f) => f.toLowerCase().includes(q));
      const matchColors = p.colors?.some((c) => c.name.toLowerCase().includes(q));
      return matchName || matchCat || matchDesc || matchFeatures || matchColors;
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Search Collection
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Find backpacks, crossbody bags, jeans, graphic tees, or accessories
        </p>

        {/* Search input field */}
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, color, category..."
            className="w-full pl-12 pr-10 py-3.5 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B85C6E] focus:border-transparent text-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick popular search tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-500">
          <span>Popular:</span>
          {["Backpack", "Crossbody", "Goyard", "Jeans", "T-Shirt", "Wallet"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            {query ? `Results for "${query}"` : "All Products"}
          </h2>
          <span className="text-xs text-gray-500">
            Found {matchedProducts.length} items
          </span>
        </div>

        {matchedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {matchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl p-8 space-y-3">
            <p className="text-gray-600 font-medium">
              No products found matching &quot;{query}&quot;.
            </p>
            <p className="text-xs text-gray-400">
              Try searching for &quot;backpack&quot;, &quot;crossbody&quot;, or browse our categories.
            </p>
            <button
              onClick={() => setQuery("")}
              className="text-xs font-bold text-[#B85C6E] hover:underline"
            >
              Clear search query
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
