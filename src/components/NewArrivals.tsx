"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { useProductsStore } from "@/stores/products-store";
import { PRODUCTS } from "@/lib/constants";

export default function NewArrivals() {
  const storeProducts = useProductsStore((s) => s.products);
  const products = storeProducts.length > 0 ? storeProducts : PRODUCTS;

  // Filter only products with an image and price
  const eligibleProducts = products.filter(
    (p) => p.images && p.images.length > 0 && typeof p.price === "number" && p.price > 0
  );

  // Sort by createdAt desc if present
  const sorted = [...eligibleProducts].sort((a, b) => {
    const dateA = (a as { createdAt?: string }).createdAt;
    const dateB = (b as { createdAt?: string }).createdAt;
    if (dateA && dateB) {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    }
    if (dateA) return -1;
    if (dateB) return 1;
    return 0;
  });

  // Show 8 items max; trim to multiples of 4 so rows are complete on both 4-col desktop and 2-col mobile
  const rowCount = Math.floor(sorted.length / 4);
  const countToShow = Math.min(8, Math.max(4, rowCount * 4));
  const displayedProducts = sorted.slice(0, countToShow);

  return (
    <section className="py-14 lg:py-24 bg-[var(--color-surface)]">
      <Container>
        <SectionHeader
          title="New arrivals"
          link={{ href: "/shop", label: "View all" }}
        />

        {/* 4-col desktop, 2-col mobile, gap 24px desktop / 16px mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
