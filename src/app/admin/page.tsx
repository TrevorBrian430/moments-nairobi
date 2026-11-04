"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  ScanBarcode,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Share2,
  Printer,
  Smartphone,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, STORE_INFO, type Product } from "@/lib/constants";
import { formatPrice, cn, generateWhatsAppLink } from "@/lib/utils";

type AdminCartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
};

export default function AdminPOSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Selected options on product cards
  const [cardSelectedSizes, setCardSelectedSizes] = useState<Record<string, string>>({});
  const [cardSelectedColors, setCardSelectedColors] = useState<Record<string, string>>({});

  // POS Cart State
  const [cartItems, setCartItems] = useState<AdminCartItem[]>([
    {
      productId: "goyard-style-backpack",
      name: "Goyard-Style Backpack",
      price: 4500,
      image: "/images/goyard style blue.jpg",
      color: "Blue",
      size: "Standard",
      quantity: 1,
    },
    {
      productId: "essentials-crossbody",
      name: "Essentials Crossbody",
      price: 2700,
      image: "/images/crossbody-bag.jpg",
      color: "Black",
      size: "One Size",
      quantity: 1,
    },
  ]);

  const [promoCode, setPromoCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa");
  const [orderProcessedModal, setOrderProcessedModal] = useState<boolean>(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        return matchName || matchCat;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      if (sortBy === "price-desc") return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Cart operations
  const addToCart = (product: Product) => {
    const size = cardSelectedSizes[product.id] || (product.sizes ? product.sizes[0] : "Standard");
    const color = cardSelectedColors[product.id] || (product.colors ? product.colors[0].name : "Standard");
    const price = product.salePrice ?? product.price;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price,
          image: product.images[0],
          size,
          color,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const next = [...prev];
      const item = next[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...item, quantity: newQty };
      }
      return next;
    });
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = 0; // Kenya standard flat or inclusive
  const grandTotal = subtotal - discountAmount + taxAmount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "MOMENTS10") {
      setDiscountPercent(10);
      alert("Promo MOMENTS10 Applied! 10% Discount active.");
    } else if (promoCode.trim().toUpperCase() === "TWILIGHT20") {
      setDiscountPercent(20);
      alert("Staff Discount TWILIGHT20 Applied! 20% Discount active.");
    } else {
      alert("Invalid promo code. Try MOMENTS10");
    }
  };

  return (
    <div className="flex w-full h-[88vh] overflow-hidden bg-slate-50">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 p-5">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-[#B85C6E] flex items-center justify-center text-white font-bold text-xl shadow-md">
              M
            </div>
            <div>
              <div className="font-bold text-gray-900 leading-tight">
                Moments
              </div>
              <div className="text-[11px] text-gray-400 font-medium tracking-wide">
                POS &amp; INVENTORY
              </div>
            </div>
          </div>

          {/* Main nav items */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                8
              </span>
            </button>

            {/* Active menu item */}
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#B85C6E]/10 text-[#B85C6E] transition-colors">
              <ShoppingBag className="h-4 w-4 text-[#B85C6E]" />
              <span>Products &amp; POS</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Receipt className="h-4 w-4" />
              <span>Transactions</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Invoices</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </button>
          </nav>
        </div>

        {/* Bottom utility links */}
        <div className="space-y-1 pt-6 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Help Center</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* 2. CENTER CONTENT: PRODUCT GRID */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top bar inside center */}
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                MENU &gt; ORDERS
              </div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                List Product
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert("Barcode scanner active on hardware interface.")}
                className="flex items-center gap-2 border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                <ScanBarcode className="h-4 w-4 text-gray-500" />
                <span>Scan Barcode</span>
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search product..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-56 focus:outline-none focus:ring-1 focus:ring-[#B85C6E]"
                />
              </div>
            </div>
          </div>

          {/* Category filter tabs & sort */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0",
                  selectedCategory === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0",
                    selectedCategory === cat.slug
                      ? "bg-[#B85C6E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-700 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Products cards scroll area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const activeSize =
                cardSelectedSizes[product.id] ||
                (product.sizes ? product.sizes[0] : "Standard");
              const activeColor =
                cardSelectedColors[product.id] ||
                (product.colors ? product.colors[0].name : "Standard");
              const price = product.salePrice ?? product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 mb-3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {product.category.replace("-", " ")}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    {/* Sizes selection chips */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mt-3">
                        <div className="text-[10px] text-gray-400 font-semibold mb-1">
                          SIZE
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() =>
                                setCardSelectedSizes((prev) => ({
                                  ...prev,
                                  [product.id]: s,
                                }))
                              }
                              className={cn(
                                "h-6 px-2 rounded-md text-[10px] font-bold border transition-colors",
                                activeSize === s
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors selection dots */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mt-2.5">
                        <div className="text-[10px] text-gray-400 font-semibold mb-1">
                          COLOR
                        </div>
                        <div className="flex items-center gap-1.5">
                          {product.colors.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() =>
                                setCardSelectedColors((prev) => ({
                                  ...prev,
                                  [product.id]: c.name,
                                }))
                              }
                              title={c.name}
                              className={cn(
                                "h-4 w-4 rounded-full border transition-all",
                                activeColor === c.name
                                  ? "ring-2 ring-[#B85C6E] ring-offset-1 scale-110"
                                  : "border-gray-200"
                              )}
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and Add button */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="font-extrabold text-sm text-gray-900">
                      {formatPrice(price)}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="bg-gray-100 hover:bg-[#B85C6E] hover:text-white text-gray-900 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. RIGHT COLUMN: POS LIVE CART & CHECKOUT (From Dribbble Ref 3) */}
      <aside className="w-80 bg-slate-50 border-l border-gray-200 flex flex-col justify-between shrink-0 p-5">
        <div className="space-y-4 overflow-hidden flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Cart
              </h3>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                CART DETAILS
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Cart list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-gray-900 truncate">
                      {item.name}
                    </h5>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.color}</span>
                    </div>
                    <div className="font-extrabold text-xs text-gray-900 mt-1">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, -1)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, 1)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                No items in cart. Click &quot;Add to cart&quot; on products to register.
              </div>
            )}
          </div>
        </div>

        {/* Payment details summary */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            PAYMENT DETAILS
          </div>

          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Sub Total:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountPercent}%):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax / VAT:</span>
              <span className="text-gray-400">Included</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
              <span>TOTAL:</span>
              <span className="text-[#B85C6E]">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Promo code field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Promo code (e.g. MOMENTS10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#B85C6E]"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-black"
            >
              Apply
            </button>
          </div>

          {/* Payment Method selector */}
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 focus:outline-none"
            >
              <option value="mpesa">💚 M-Pesa (Buy Goods / Till: 0702947981)</option>
              <option value="cash">💵 Cash on Hand (In-Store)</option>
              <option value="card">💳 Credit / Debit Card (PDQ)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>

          {/* Action button */}
          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => setOrderProcessedModal(true)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            <span>Process Payment &amp; Print</span>
          </button>
        </div>
      </aside>

      {/* Processed Modal */}
      {orderProcessedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold text-gray-900">
                Transaction Successful!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Receipt #MN-{Math.floor(100000 + Math.random() * 900000)} generated at Twilight Suites F4-08
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-gray-100">
              <div className="flex justify-between font-semibold">
                <span>Payment Method:</span>
                <span className="uppercase text-green-700 font-bold">{paymentMethod}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Items Count:</span>
                <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} items</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2">
                <span>Total Paid:</span>
                <span className="text-gray-900">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderProcessedModal(false);
                  clearCart();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black"
              >
                Done / Next Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
