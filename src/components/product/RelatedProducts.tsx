import React from "react";
import { type Product } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
  className?: string;
}

export function RelatedProducts({
  currentProduct,
  allProducts,
  className,
}: RelatedProductsProps) {
  // Filter: same category, different product, different primary image
  const related = allProducts
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.category === currentProduct.category &&
        p.images[0] !== currentProduct.images[0]
    )
    .slice(0, 4);

  // If fewer than 2 qualify, hide completely (never show orphan card)
  if (related.length < 2) {
    return null;
  }

  const categoryName = currentProduct.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <section className={className}>
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#E4E0D8]">
        <h2 className="font-heading text-xl sm:text-2xl font-medium text-[#111111]">
          More in {categoryName}
        </h2>
        <Link
          href={`/shop?category=${currentProduct.category}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#6B6B66] hover:text-[#BB4C6C] transition-colors group"
        >
          <span>View all {categoryName.toLowerCase()}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
