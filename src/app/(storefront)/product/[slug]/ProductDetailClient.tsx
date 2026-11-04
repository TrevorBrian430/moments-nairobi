"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Check,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { type Product, STORE_INFO } from "@/lib/constants";
import { formatPrice, generateWhatsAppLink, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import ProductCard from "@/components/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const displayPrice = product.salePrice ?? product.price;

  // Handle color change (also switch image if color has a specific image)
  const handleColorSelect = (colorName: string, colorImage?: string) => {
    setSelectedColor(colorName);
    if (colorImage) {
      setSelectedImage(colorImage);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: displayPrice,
        image: selectedImage,
        color: selectedColor,
        size: selectedSize,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: selectedImage,
      color: selectedColor,
      size: selectedSize,
    });
    router.push("/checkout");
  };

  const whatsappMessage = `Hi Moments Nairobi! 👋\nI want to order:\n• ${product.name}${
    selectedColor ? ` (Color: ${selectedColor})` : ""
  }${selectedSize ? ` (Size: ${selectedSize})` : ""} × ${quantity}\nPrice: ${formatPrice(
    displayPrice * quantity
  )}\n\nDelivery to: [Please deliver to my address / I will pick up at Twilight Suites]`;

  const whatsappUrl = generateWhatsAppLink(STORE_INFO.whatsappPhone, whatsappMessage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-gray-900 transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-gray-900 transition-colors capitalize"
        >
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium truncate">
          {product.name}
        </span>
      </nav>

      {/* Main product showcase grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 border border-gray-100 shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-300"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 rounded-full bg-[#B85C6E] text-white px-3 py-1 text-xs font-bold tracking-wide shadow-md">
                NEW RELEASE
              </span>
            )}
            {product.stockCount && product.stockCount < 10 && (
              <span className="absolute top-4 right-4 rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-semibold shadow-md">
                Only {product.stockCount} left!
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === img
                      ? "border-[#B85C6E] ring-2 ring-[#B85C6E]/20 scale-105"
                      : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase options (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-700 font-bold">5.0</span>
              <span className="text-gray-400 font-normal">(48 customer reviews)</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price block */}
          <div className="border-y border-gray-100 py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="text-xs text-green-600 font-medium mt-1">
              ✓ In stock &amp; available for instant delivery / CBD pickup
            </div>
          </div>

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block">
                Choose Color: <span className="text-gray-900 font-bold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorSelect(c.name, c.image)}
                    title={c.name}
                    className={cn(
                      "group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                      selectedColor === c.name
                        ? "border-[#B85C6E] bg-[#B85C6E]/5 text-gray-900 ring-1 ring-[#B85C6E]"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    )}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Select Size: <span className="text-gray-900 font-bold">{selectedSize}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "min-w-12 h-10 px-3 rounded-xl border text-xs font-bold transition-all",
                      selectedSize === s
                        ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Urgency */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-gray-200 rounded-full px-3 py-1.5 bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-3 py-1.5 font-medium">
              ⚡ High demand item in Nairobi
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 px-6 rounded-full text-sm shadow-md transition-all active:scale-95"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={cn(
                  "w-full font-semibold py-3.5 px-6 rounded-full text-sm border-2 transition-all flex items-center justify-center gap-2",
                  added
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-900 text-gray-900 hover:bg-gray-50 active:scale-95"
                )}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd59] text-white py-3.5 px-6 rounded-full text-sm font-semibold shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Order via WhatsApp (0702 947 981)</span>
            </a>
          </div>

          {/* Delivery & Physical Store Assurance Box */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 space-y-3.5 text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <Truck className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Delivery Options:</span>{" "}
                Free delivery within Nairobi CBD. Fast dispatch countrywide (KES 300 - 500).
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Physical Store Pickup:</span>{" "}
                Twilight Suites, 4th Floor, Shop 08, Tom Mboya Street (Opposite Eastmart Supermarket).
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Hassle-Free Exchange:</span>{" "}
                Easy size or color exchange if unworn with tags attached.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Payment on Delivery:</span>{" "}
                Available for Nairobi orders via M-Pesa.
              </div>
            </div>
          </div>

          {/* Features bullet points */}
          {product.features && product.features.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                Product Highlights
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B85C6E]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 border-t border-gray-100 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs sm:text-sm font-semibold text-[#B85C6E] hover:underline"
            >
              More in this collection →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
