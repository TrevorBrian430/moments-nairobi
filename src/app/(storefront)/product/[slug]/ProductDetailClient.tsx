"use client";

import { useState, useEffect } from "react";
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
  Flame,
  Clock,
  HelpCircle,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "delivery" | "faq">("desc");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayPrice = product.salePrice ?? product.price;

  // Handle color change: updates color AND immediately switches the featured image
  const handleColorSelect = (colorName: string, colorImage?: string) => {
    setSelectedColor(colorName);

    if (colorImage) {
      setSelectedImage(colorImage);
      return;
    }

    // Auto-match image from product images based on color name keyword
    const nameLower = colorName.toLowerCase();
    const matched = product.images.find((img) => {
      const imgLower = img.toLowerCase();
      if (nameLower.includes("brown") && (imgLower.includes("brown") || imgLower.includes("bagpack 1"))) return true;
      if (nameLower.includes("black") && (imgLower.includes("black") || imgLower.includes("bagpack 2") || imgLower.includes("bagpack 3"))) return true;
      if (nameLower.includes("blue") && imgLower.includes("blue")) return true;
      if (nameLower.includes("maroon") && imgLower.includes("maroon")) return true;
      if (nameLower.includes("green") && (imgLower.includes("green") || imgLower.includes("goyard style.jpg"))) return true;
      if (nameLower.includes("grey") && imgLower.includes("grey")) return true;
      if (nameLower.includes("khaki") && (imgLower.includes("khaki") || imgLower.includes("crossbody-bag 2"))) return true;
      return false;
    });

    if (matched) {
      setSelectedImage(matched);
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 overflow-x-hidden">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 overflow-x-auto">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Active Featured Image */}
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-gray-100 shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-300 pointer-events-none"
            />
            {product.isNew && (
              <span className="absolute top-3 left-3 rounded-full bg-[#B85C6E] text-white px-2.5 py-0.5 text-[11px] sm:text-xs font-bold tracking-wide shadow-md">
                NEW RELEASE
              </span>
            )}
            {product.stockCount && product.stockCount < 10 && (
              <span className="absolute top-3 right-3 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold shadow-md">
                Only {product.stockCount} left!
              </span>
            )}
          </div>

          {/* Thumbnails list — optimized for mobile tap */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer touch-manipulation select-none active:scale-95 snap-start",
                    selectedImage === img
                      ? "border-[#B85C6E] ring-2 ring-[#B85C6E]/30 scale-105"
                      : "border-gray-200 opacity-75 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover pointer-events-none"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase options (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold mb-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="text-gray-700 font-bold">5.0</span>
              <span className="text-gray-400 font-normal">(48 reviews)</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price block */}
          <div className="border-y border-gray-100 py-3.5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="text-[11px] sm:text-xs text-green-600 font-semibold mt-1">
              ✓ In stock &bull; CBD Free Pickup / Fast Countrywide Dispatch
            </div>
          </div>

          {/* ELLA-inspired Urgency Countdown & Scarcity Box */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 sm:p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Flame className="h-4 w-4 text-[#B85C6E] animate-pulse" />
                <span>LIMITED TIME DROP</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] font-extrabold text-gray-900">
                <span className="bg-white px-1.5 py-0.5 rounded shadow-xs border border-amber-200">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                <span>:</span>
                <span className="bg-white px-1.5 py-0.5 rounded shadow-xs border border-amber-200">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                <span>:</span>
                <span className="bg-white px-1.5 py-0.5 rounded shadow-xs border border-amber-200 text-[#B85C6E]">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>

            {/* Inventory progress meter */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-700 mb-1">
                <span>Only <strong className="text-[#B85C6E]">3 items left</strong> in shop</span>
                <span className="text-gray-500">14 people viewing</span>
              </div>
              <div className="h-1.5 w-full bg-amber-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-[#B85C6E] rounded-full w-[78%]" />
              </div>
            </div>
          </div>

          {/* Color selector — optimized for mobile tap */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                Choose Color: <span className="text-[#B85C6E] font-extrabold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorSelect(c.name, c.image)}
                    className={cn(
                      "group relative flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer touch-manipulation active:scale-95",
                      selectedColor === c.name
                        ? "border-[#B85C6E] bg-[#B85C6E]/10 text-gray-900 ring-2 ring-[#B85C6E]/30"
                        : "border-gray-200 text-gray-700 bg-white hover:border-gray-400"
                    )}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0 pointer-events-none"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="pointer-events-none">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Size: <span className="text-gray-900 font-extrabold">{selectedSize}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "min-w-11 h-10 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer touch-manipulation active:scale-95",
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
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer touch-manipulation"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4 pointer-events-none" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-gray-900 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer touch-manipulation"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4 pointer-events-none" />
              </button>
            </div>

            <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-3 py-1 font-semibold">
              ⚡ Popular in Nairobi
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer touch-manipulation"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={cn(
                  "w-full font-bold py-3.5 px-4 rounded-full text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95",
                  added
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-900 text-gray-900 hover:bg-gray-50"
                )}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Added!</span>
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
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd59] text-white py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Order via WhatsApp (0702 947 981)</span>
            </a>
          </div>

          {/* Delivery & Physical Store Assurance Box */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-3 text-xs text-gray-600">
            <div className="flex items-start gap-2.5">
              <Truck className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Delivery:</span>{" "}
                Free within Nairobi CBD. Countrywide courier KES 300 - 500.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Pickup:</span>{" "}
                Twilight Suites F4-08, Tom Mboya St (Opp. Eastmart Supermarket).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Exchange:</span>{" "}
                Hassle-free size or color swap with tags attached.
              </div>
            </div>
          </div>

          {/* Features bullet points */}
          {product.features && product.features.length > 0 && (
            <div className="pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                Product Details
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

      {/* ELLA-inspired Tabbed Specifications */}
      <section className="mt-12 sm:mt-16 border-t border-gray-100 pt-8">
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide gap-4 sm:gap-8 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={cn(
              "pb-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer touch-manipulation",
              activeTab === "desc"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            )}
          >
            Description & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={cn(
              "pb-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer touch-manipulation",
              activeTab === "specs"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            )}
          >
            Materials & Fit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("delivery")}
            className={cn(
              "pb-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer touch-manipulation",
              activeTab === "delivery"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            )}
          >
            CBD Pickup & Courier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={cn(
              "pb-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer touch-manipulation",
              activeTab === "faq"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            )}
          >
            WhatsApp Order FAQ
          </button>
        </div>

        <div className="py-6 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
          {activeTab === "desc" && (
            <div className="space-y-4">
              <p className="font-medium text-gray-900">{product.description}</p>
              <p>
                Every piece in our collection is handpicked to combine statement urban luxury with everyday practicality. Built with heavy-duty zips, water-resistant canvas, and reinforced straps engineered for Nairobi commuting, campus life, and weekend outings.
              </p>
              {product.features && (
                <div className="grid sm:grid-cols-2 gap-2 pt-2">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B85C6E]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Material</span>
                  <span className="font-semibold text-gray-900">Heavy-Duty Coated Canvas / Leather Trim</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Hardware</span>
                  <span className="font-semibold text-gray-900">Reinforced Gunmetal Zippers</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Capacity</span>
                  <span className="font-semibold text-gray-900">Fits 15-Inch Laptop + Daily Gear</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Origin</span>
                  <span className="font-semibold text-gray-900">Curated & Tested in Nairobi</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#B85C6E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Free In-Store CBD Pickup:</strong>
                  <p className="mt-0.5">Collect at Twilight Suites, 4th Floor, Shop F4-08, Tom Mboya Street (Opposite Eastmart Supermarket). Open Mon–Sat: 8:30 AM – 7:30 PM.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-gray-200/50">
                <Truck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Countrywide Courier Dispatch:</strong>
                  <p className="mt-0.5">Dispatched daily to Mombasa, Nakuru, Kisumu, Eldoret, Thika, Machakos & across Kenya (KES 300 - 500, delivery within 24 hours).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-3">
              <div className="border border-gray-100 rounded-xl p-3 bg-white">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">How do I order via WhatsApp?</h4>
                <p className="mt-1 text-xs text-gray-600">Click the green &ldquo;Order via WhatsApp&rdquo; button. Your selected color, size, and quantity are automatically formatted into a message. Send it to us, confirm your delivery address, and we arrange dispatch right away!</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 bg-white">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">What payment methods do you accept?</h4>
                <p className="mt-1 text-xs text-gray-600">We accept Lipa na M-Pesa (Till / Send Money), Cash on Delivery within Nairobi CBD, and Card payments at checkout.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 sm:mt-20 border-t border-gray-100 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs font-semibold text-[#B85C6E] hover:underline"
            >
              View collection &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Bottom Quick-Purchase Bar */}
      {showStickyBar && (
        <aside
          aria-label="Quick order options"
          className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-2xl lg:hidden flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-neutral-100">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-gray-900 truncate">
                {product.name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-extrabold text-[#B85C6E]">
                  {formatPrice(displayPrice)}
                </span>
                {selectedColor && (
                  <span className="text-gray-400 truncate">
                    &bull; {selectedColor}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className="p-2.5 rounded-full bg-[#25D366] text-white shadow-md active:scale-95 transition-transform"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-transform whitespace-nowrap"
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
