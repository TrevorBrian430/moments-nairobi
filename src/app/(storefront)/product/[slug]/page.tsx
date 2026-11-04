import { notFound } from "next/navigation";
import { PRODUCTS, STORE_INFO } from "@/lib/constants";
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

export default async function ProductPage({
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
