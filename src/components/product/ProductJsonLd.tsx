import React from "react";
import { type Product, STORE_INFO } from "@/lib/constants";

export interface ProductJsonLdProps {
  product: Product;
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  // Strip any third-party brand references
  const cleanName = product.name
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  const cleanDescription = product.description
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  const isAvailable =
    product.inStock &&
    (product.stockCount === undefined || product.stockCount > 0);

  const displayPrice = product.salePrice ?? product.price;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanName,
    description: cleanDescription,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${STORE_INFO.website}${img}`
    ),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Moments Nairobi",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "KES",
      price: displayPrice,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Moments Nairobi",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
