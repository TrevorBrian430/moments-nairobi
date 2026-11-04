import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/constants";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Moments Nairobi",
    };
  }

  return {
    title: `${product.name} | Moments Nairobi`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Moments Nairobi`,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={
        relatedProducts.length > 0
          ? relatedProducts
          : PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4)
      }
    />
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-400">
          <div className="animate-pulse space-y-4 max-w-md mx-auto">
            <div className="h-64 bg-gray-100 rounded-2xl" />
            <div className="h-6 bg-gray-100 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
          </div>
        </div>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}
