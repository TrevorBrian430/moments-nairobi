"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProductsStore } from "@/stores/products-store";
import ProductCard from "@/components/ProductCard";
import { Search as SearchIcon, X } from "lucide-react";
import { Container } from "@/components/ui/Container";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const products = useProductsStore((s) => s.products);
  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFeatures = p.features.some((f) => f.toLowerCase().includes(q));
      const matchColors = p.colors?.some((c) => c.name.toLowerCase().includes(q));
      return matchName || matchCat || matchDesc || matchFeatures || matchColors;
    });
  }, [query, products]);

  return (
    <div className="w-full bg-[var(--color-background)] min-h-screen py-10 sm:py-16">
      <Container>
        <div className="max-w-2xl mx-auto text-left sm:text-center mb-10">
          <h1 className="font-heading font-medium text-[clamp(28px,3vw,36px)] text-[var(--color-ink)] leading-tight tracking-[-0.02em] mb-2">
            Search
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mb-6">
            Find backpacks, crossbody bags, clothing, or accessories
          </p>

          {/* Search input field */}
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 h-4 w-4 text-[var(--color-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name, category, or color..."
              className="w-full pl-11 pr-10 py-3 text-sm rounded-[2px] border border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 p-1.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Neutral suggestion tags (zero trademark brand names) */}
          <div className="flex flex-wrap items-center sm:justify-center gap-2 mt-4 text-xs text-[var(--color-muted)]">
            <span className="font-medium">Suggestions:</span>
            {["Backpack", "Crossbody", "Laptop Bag", "Denim", "T-Shirt", "Wallet"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-hairline)] hover:border-[var(--color-ink)] text-[var(--color-ink)] rounded-[2px] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-[var(--color-hairline)] pb-4">
            <h2 className="text-xs uppercase tracking-[0.12em] font-medium text-[var(--color-muted)]">
              {query ? `Results for "${query}"` : "All Products"}
            </h2>
            <span className="text-xs text-[var(--color-muted)]">
              {matchedProducts.length} {matchedProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {matchedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {matchedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 4} />
              ))}
            </div>
          ) : (
            <div className="text-left py-12 border-t border-[var(--color-hairline)] space-y-3">
              <p className="text-sm text-[var(--color-muted)]">
                No products match &quot;{query}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                Clear search query
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-12">
          <div className="h-10 w-48 bg-[var(--color-surface-fallback)] animate-pulse rounded-[2px] mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-[var(--color-surface-fallback)] animate-pulse rounded-[2px]"
              />
            ))}
          </div>
        </Container>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
