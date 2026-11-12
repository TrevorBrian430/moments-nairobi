"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { type Category, type Product } from "@/lib/constants";
import { useProductsStore } from "@/stores/products-store";
import { parseShopParams, serializeShopParams, ShopFilterParams } from "@/lib/shop-params";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import FilterRail from "@/components/shop/FilterRail";
import FilterDrawer from "@/components/shop/FilterDrawer";
import SortSelect, { SortValue } from "@/components/shop/SortSelect";
import ActiveFilterChips from "@/components/shop/ActiveFilterChips";
import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";
import EmptyState from "@/components/shop/EmptyState";

const PAGE_SIZE = 12;

export default function ShopCatalog({ initialCategories, initialProducts }: { initialCategories: Category[]; initialProducts: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Mobile filter drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Products from store / fallback
  const categories = useProductsStore((s) => s.ready ? s.categories : initialCategories);
  const allProducts = useProductsStore((s) => s.ready ? s.products : initialProducts);

  // Parse current URL params
  const filterParams = useMemo(() => {
    const params = parseShopParams(searchParams);
    if (params.category && !categories.some(({ slug }) => slug === params.category)) delete params.category;
    return params;
  }, [searchParams, categories]);

  const filterKey = serializeShopParams(filterParams);
  const [pagination, setPagination] = useState({ filterKey, count: PAGE_SIZE });
  if (pagination.filterKey !== filterKey) setPagination({ filterKey, count: PAGE_SIZE });
  const visibleCount = pagination.filterKey === filterKey ? pagination.count : PAGE_SIZE;

  // Update URL helper without history spam or scroll jumps
  const updateParams = (newParams: Partial<ShopFilterParams>) => {
    const updated: ShopFilterParams = {
      ...filterParams,
      ...newParams,
    };
    const queryString = serializeShopParams(updated);
    startTransition(() => {
      router.replace(`${pathname}${queryString}`, { scroll: false });
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category
        if (filterParams.category && p.category !== filterParams.category) {
          return false;
        }

        // Price
        const effPrice = p.salePrice ?? p.price;
        if (typeof filterParams.min === "number" && effPrice < filterParams.min) {
          return false;
        }
        if (typeof filterParams.max === "number" && effPrice > filterParams.max) {
          return false;
        }

        // Color
        if (filterParams.color && filterParams.color.length > 0) {
          const productColors = p.colors?.map((c) => c.name.toLowerCase()) || [];
          const matches = filterParams.color.some((selectedColor) =>
            productColors.some((pc) => pc.includes(selectedColor) || selectedColor.includes(pc))
          );
          if (!matches) return false;
        }

        // Size
        if (filterParams.size && filterParams.size.length > 0) {
          const productSizes = p.sizes || [];
          const matches = filterParams.size.some((selectedSize) =>
            productSizes.includes(selectedSize)
          );
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (filterParams.sort === "price-asc") return priceA - priceB;
        if (filterParams.sort === "price-desc") return priceB - priceA;

        // Default Newest (dated products first, then existing catalog order)
        const dateA = a.createdAt;
        const dateB = b.createdAt;
        if (dateA && dateB) {
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        }
        if (dateA) return -1;
        if (dateB) return 1;
        return 0;
      });
  }, [allProducts, filterParams]);

  // Current category information
  const categoryInfo = filterParams.category
    ? categories.find((c) => c.slug === filterParams.category)
    : null;

  const categoryName = categoryInfo ? categoryInfo.name : "All products";
  const categoryDesc = categoryInfo ? categoryInfo.description : undefined;

  // Active filter count for mobile badge
  const activeFilterCount =
    (filterParams.category ? 1 : 0) +
    (typeof filterParams.min === "number" || typeof filterParams.max === "number" ? 1 : 0) +
    (filterParams.color?.length || 0) +
    (filterParams.size?.length || 0);

  // Paginated visible slice
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="w-full bg-[var(--color-background)] min-h-screen">
      {/* 1. Page Header: Breadcrumb, H1, Result count */}
      <div className="border-b border-[var(--color-hairline)] pt-8 pb-8">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">/</li>
              <li>
                <Link
                  href="/shop"
                  className={categoryInfo ? "hover:text-[var(--color-ink)] transition-colors" : "text-[var(--color-ink)] font-medium"}
                >
                  Shop
                </Link>
              </li>
              {categoryInfo && (
                <>
                  <li aria-hidden="true" className="opacity-40">/</li>
                  <li className="text-[var(--color-ink)] font-medium" aria-current="page">
                    {categoryInfo.name}
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Heading and Factual result count */}
          <h1 className="font-heading font-medium text-[clamp(28px,3vw,40px)] text-[var(--color-ink)] leading-tight tracking-[-0.02em]">
            {categoryName}
          </h1>

          {categoryDesc && (
            <p className="text-sm text-[var(--color-muted)] mt-1 max-w-xl">
              {categoryDesc}
            </p>
          )}

          <p className="text-xs text-[var(--color-muted)] mt-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </Container>
      </div>

      {/* 2. Toolbar row: Hairline top and bottom, sticky on mobile */}
      <div className="sticky top-16 z-30 bg-[var(--color-background)]/95 backdrop-blur-xs border-b border-[var(--color-hairline)]">
        <Container>
          <div className="flex items-center justify-between py-2.5 sm:py-3 gap-4">
            {/* Left: Mobile Filters button & desktop count */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={`Open filters. ${activeFilterCount} active.`}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[2px] min-h-[44px] cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-[999px] bg-[var(--color-accent)] text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <span
                aria-live="polite"
                className="text-xs text-[var(--color-muted)] hidden lg:inline"
              >
                Showing {displayedProducts.length} of {filteredProducts.length} items
              </span>
            </div>

            {/* Right: Sort select */}
            <SortSelect
              value={filterParams.sort || "newest"}
              onChange={(newSort: SortValue) => updateParams({ sort: newSort })}
            />
          </div>

          {/* Active filter chips (horizontal scroll on mobile) */}
          <ActiveFilterChips
            params={filterParams}
            onRemoveCategory={() => updateParams({ category: undefined })}
            onRemovePrice={() => updateParams({ min: undefined, max: undefined })}
            onRemoveColor={(colorToRemove) => {
              const current = filterParams.color || [];
              const next = current.filter((c) => c !== colorToRemove);
              updateParams({ color: next.length > 0 ? next : undefined });
            }}
            onRemoveSize={(sizeToRemove) => {
              const current = filterParams.size || [];
              const next = current.filter((s) => s !== sizeToRemove);
              updateParams({ size: next.length > 0 ? next : undefined });
            }}
            onClearAll={handleClearAll}
          />
        </Container>
      </div>

      {/* 3. Two-column body: Left filter rail (sticky) + Right product grid */}
      <div className="py-8 lg:py-12">
        <Container>
          <div className="flex items-start gap-10">
            {/* Desktop Filter Rail (260px, sticky) */}
            <div className="hidden lg:block w-[260px] shrink-0 sticky top-[136px]">
              <FilterRail
                params={filterParams}
                allProducts={allProducts}
                onFilterChange={updateParams}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Right Product Grid Area */}
            <div className="flex-1 min-w-0">
              {isPending ? (
                <ProductGridSkeleton count={PAGE_SIZE} />
              ) : displayedProducts.length > 0 ? (
                <div className="space-y-10">
                  {/* 3 cols on lg (1024-1279px), 4 cols on xl (>= 1280px), 2 cols on mobile */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {displayedProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        priority={idx < 4}
                      />
                    ))}
                  </div>

                  {/* Pagination / Load More Footer */}
                  <div className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-[var(--color-muted)]">
                      Showing {displayedProducts.length} of {filteredProducts.length}
                    </span>

                    {hasMore && (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setPagination({ filterKey, count: visibleCount + PAGE_SIZE })}
                        className="w-full sm:w-auto min-h-[44px] px-8 text-xs font-medium"
                      >
                        Load more
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyState
                  onClear={handleClearAll}
                  suggestions={allProducts.filter((product) => !filterParams.category || product.category === filterParams.category).slice(0, 4)}
                />
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        params={filterParams}
        allProducts={allProducts}
        onFilterChange={updateParams}
        onClearAll={handleClearAll}
        totalResults={filteredProducts.length}
      />
    </div>
  );
}
