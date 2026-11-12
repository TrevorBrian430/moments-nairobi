"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { type Product } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { Gallery } from "@/components/product/Gallery";
import { VariantSelector, type ColorVariant } from "@/components/product/VariantSelector";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { AddToCart } from "@/components/product/AddToCart";
import { WhatsAppOrderButton } from "@/components/product/WhatsAppOrderButton";
import { InfoRows } from "@/components/product/InfoRows";
import { DetailsAccordion } from "@/components/product/DetailsAccordion";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { StickyMobileBar } from "@/components/product/StickyMobileBar";

export interface ProductDetailClientProps {
  product: Product;
  allProducts: Product[];
  categoryName?: string;
}

export default function ProductDetailClient({
  product,
  allProducts,
  categoryName,
}: ProductDetailClientProps) {
  // Safe variant fallback
  const initialColor =
    product.colors && product.colors.length > 0
      ? product.colors[0].name
      : undefined;

  const initialSize =
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    initialColor
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    initialSize
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // Ref to the primary Add to Cart button for the mobile sticky bar observer
  const addToCartRef = useRef<HTMLDivElement>(null);

  // Clean brand mentions from product name and description
  const cleanName = product.name
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  const cleanDescription = product.description
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  // Format category for breadcrumb and label
  const categorySlug = product.category;
  const categoryLabel = categoryName ?? categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Color selection handling: update color and jump gallery to that variant's image if present
  const handleSelectColor = (color: ColorVariant) => {
    setSelectedColor(color.name);

    if (color.image) {
      const imgIdx = product.images.indexOf(color.image);
      if (imgIdx !== -1) {
        setSelectedImageIndex(imgIdx);
      }
    }
  };

  // Find the selected variant image (to guarantee correct cart thumbnail)
  const currentVariant = product.colors?.find((c) => c.name === selectedColor);
  const selectedVariantImage =
    currentVariant?.image || product.images[selectedImageIndex] || product.images[0];

  const displayPrice = product.salePrice ?? product.price;
  const hasComparePrice = Boolean(
    product.salePrice && product.salePrice < product.price
  );

  const isOutOfStock =
    !product.inStock ||
    (product.stockCount !== undefined && product.stockCount <= 0);

  // Max quantity: stockCount if known and positive, else 10
  const maxQty =
    product.stockCount && product.stockCount > 0 ? product.stockCount : 10;

  // Real stock label
  const stockText = !product.inStock
    ? "Out of stock"
    : product.stockCount !== undefined && product.stockCount <= 5
    ? `Low stock: ${product.stockCount} left`
    : "In stock";

  return (
    <div className="bg-[#F6F4F0] min-h-screen py-6 sm:py-10">
      <Container>
        {/* Breadcrumb: Home / Shop / Category / Product name */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 sm:mb-8 text-[13px] text-[#6B6B66] flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-[#111111] transition-colors">
            Home
          </Link>
          <span className="text-[#E4E0D8]">/</span>
          <Link href="/shop" className="hover:text-[#111111] transition-colors">
            Shop
          </Link>
          <span className="text-[#E4E0D8]">/</span>
          <Link
            href={`/shop?category=${categorySlug}`}
            className="hover:text-[#111111] transition-colors"
          >
            {categoryLabel}
          </Link>
          <span className="text-[#E4E0D8]">/</span>
          <span className="text-[#111111] truncate max-w-[240px] sm:max-w-none">
            {cleanName}
          </span>
        </nav>

        {/* 12-Column Grid: Left 7 Gallery, Right 5 Sticky Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT 7 COLUMNS: GALLERY */}
          <div className="lg:col-span-7">
            <Gallery
              images={product.images}
              productName={cleanName}
              selectedImageIndex={selectedImageIndex}
              onSelectImageIndex={setSelectedImageIndex}
            />
          </div>

          {/* RIGHT 5 COLUMNS: INFO COLUMN (sticky desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-[88px] space-y-6">
            {/* 1. Category label */}
            <div>
              <Link
                href={`/shop?category=${categorySlug}`}
                className="text-[11px] uppercase tracking-[0.12em] text-[#6B6B66] hover:text-[#111111] font-medium transition-colors"
              >
                {categoryLabel}
              </Link>
            </div>

            {/* 2. Product name h1 */}
            <h1
              className="font-heading font-medium text-[#111111] tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              {cleanName}
            </h1>

            {/* 3. Price */}
            <div>
              <Price
                amount={displayPrice}
                originalAmount={hasComparePrice ? product.price : undefined}
                className="text-2xl font-medium text-[#111111]"
              />
            </div>

            {/* 4. One-line description from data (max 2 lines) */}
            <p className="text-sm text-[#6B6B66] leading-relaxed line-clamp-2">
              {cleanDescription}
            </p>

            {/* 5 & 6. Color and Size Selectors */}
            <VariantSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={handleSelectColor}
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* 7 & 8. Quantity Stepper + Primary Button */}
            <div className="space-y-3 pt-2" ref={addToCartRef}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="shrink-0">
                  <QuantityStepper
                    quantity={quantity}
                    onChange={setQuantity}
                    max={maxQty}
                    disabled={isOutOfStock}
                    className="w-full sm:w-auto justify-between sm:justify-start"
                  />
                </div>
                <div className="flex-1">
                  <AddToCart
                    product={product}
                    selectedColor={selectedColor}
                    selectedVariantImage={selectedVariantImage}
                    selectedSize={selectedSize}
                    quantity={quantity}
                    disabled={isOutOfStock}
                  />
                </div>
              </div>

              {/* 9. Secondary Button: Order on WhatsApp */}
              <WhatsAppOrderButton
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                quantity={quantity}
                isOutOfStock={isOutOfStock}
              />
            </div>

            {/* 10. Real stock line (only from real data) */}
            {product.inStock !== undefined && (
              <div className="text-xs text-[#6B6B66] flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOutOfStock
                      ? "bg-[#6B6B66]"
                      : product.stockCount !== undefined &&
                        product.stockCount <= 5
                      ? "bg-[#BB4C6C]"
                      : "bg-[#1FA855]"
                  }`}
                />
                <span>{stockText}</span>
              </div>
            )}

            {/* 11. Info rows (hairline separated, no box, no icons) */}
            <InfoRows />
          </div>
        </div>

        {/* DETAILS ACCORDION (full width, max 760px text width) */}
        <div className="mt-16 pt-12 border-t border-[#E4E0D8]">
          <DetailsAccordion product={product} />
        </div>

        {/* RELATED PRODUCTS ("More in [category]") */}
        <div className="mt-20">
          <RelatedProducts
            currentProduct={product}
            allProducts={allProducts}
          />
        </div>

        {/* STICKY MOBILE BAR */}
        <StickyMobileBar
          product={product}
          selectedColor={selectedColor}
          selectedVariantImage={selectedVariantImage}
          selectedSize={selectedSize}
          quantity={quantity}
          triggerRef={addToCartRef}
          disabled={isOutOfStock}
        />
      </Container>
    </div>
  );
}
