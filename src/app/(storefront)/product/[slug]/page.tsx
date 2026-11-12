import { connection } from "next/server";
import { readStore } from "@/lib/store-db";
import { notFound } from "next/navigation";
import { PRODUCTS, STORE_INFO } from "@/lib/constants";
import ProductDetailClient from "./ProductDetailClient";
import { ProductJsonLd } from "@/components/product/ProductJsonLd";
import type { Metadata } from "next";

export const instant = false;

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
  await connection();
  const { products } = await readStore();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Moments Nairobi",
    };
  }

  const cleanName = product.name
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  const cleanDescription = product.description
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  return {
    title: `${cleanName} | Moments Nairobi`,
    description: cleanDescription,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${cleanName} | Moments Nairobi`,
      description: cleanDescription,
      url: `/product/${product.slug}`,
      siteName: "Moments Nairobi",
      images: product.images.map((img) => ({
        url: img,
        alt: cleanName,
      })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connection();
  const { categories, products } = await readStore();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const canonicalUrl = `${STORE_INFO.website}/product/${product.slug}`;

  return (
    <>
      <ProductJsonLd product={product} url={canonicalUrl} />
      <ProductDetailClient categoryName={categories.find(({ slug }) => slug === product.category)?.name} product={product} allProducts={products} />
    </>
  );
}
