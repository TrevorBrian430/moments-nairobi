import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";
import { readStore } from "@/lib/store-db";
import { cleanBrandName } from "@/lib/whatsapp";
import ShopCatalog from "./ShopCatalog";

export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ category?: string | string[] }>;
}): Promise<Metadata> {
  const { category: slug } = await searchParams;
  const category = readStore().categories.find((entry) => entry.slug === slug);
  return {
    title: category ? `${cleanBrandName(category.name)} | Moments Nairobi` : "Shop | Moments Nairobi",
    description: category?.description ? cleanBrandName(category.description) : "Browse the Moments Nairobi catalog.",
    alternates: { canonical: category ? `/shop?category=${category.slug}` : "/shop" },
  };
}

async function Catalog() {
  await connection();
  const { categories, products } = readStore();
  return <ShopCatalog initialCategories={categories} initialProducts={products} />;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Container className="py-12"><ProductGridSkeleton count={12} /></Container>}>
      <Catalog />
    </Suspense>
  );
}
