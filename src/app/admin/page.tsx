"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Layers,
  BarChart3,
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  MessageCircle,
  Truck,
  DollarSign,
  Phone,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { CATEGORIES, STORE_INFO, type Product } from "@/lib/constants";
import { formatPrice, slugify, cn, generateWhatsAppLink } from "@/lib/utils";
import { useProductsStore } from "@/stores/products-store";
import { useOrdersStore, type Order, type OrderStatus } from "@/stores/orders-store";

type AdminTab = "products" | "orders" | "categories" | "analytics" | "settings";

const AVAILABLE_SAMPLE_IMAGES = [
  "/images/bagpack 1.jpg",
  "/images/bagpack 2.jpg",
  "/images/bagpack 3.jpg",
  "/images/crossbody-bag.jpg",
  "/images/crossbody-bag 2.jpg",
  "/images/crossbody-bag 3.jpg",
  "/images/goyard style.jpg",
  "/images/goyard style blue.jpg",
  "/images/goyard-maroon.jpg",
  "/images/goyard-black.jpg",
  "/images/goyard-grey.jpg",
  "/images/goyard-brown.jpg",
  "/images/shacket-white.jpg",
  "/images/shorts-tribal.jpg",
];

export default function AdminCMSPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stores
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } =
    useProductsStore();
  const { orders, updateOrderStatus, deleteOrder } = useOrdersStore();

  // Search & Filter state for products
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock">("all");

  // Product Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    category: string;
    price: number;
    salePrice?: number;
    description: string;
    featuresText: string;
    stockCount: number;
    inStock: boolean;
    isFeatured: boolean;
    isNew: boolean;
    selectedImages: string[];
    customImageUrl: string;
    sizesText: string;
    colors: { name: string; hex: string; image?: string }[];
  }>({
    name: "",
    slug: "",
    category: "backpacks",
    price: 4500,
    salePrice: undefined,
    description: "",
    featuresText: "",
    stockCount: 15,
    inStock: true,
    isFeatured: false,
    isNew: true,
    selectedImages: ["/images/bagpack 1.jpg"],
    customImageUrl: "",
    sizesText: "",
    colors: [{ name: "Black", hex: "#1a1a1a" }],
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (stockFilter === "inStock" && (!p.inStock || (p.stockCount ?? 0) <= 0))
        return false;
      if (stockFilter === "lowStock" && ((p.stockCount ?? 0) > 8 || !p.inStock))
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, stockFilter, searchQuery]);

  // Statistics
  const totalValuation = useMemo(() => {
    return products.reduce(
      (sum, p) => sum + (p.price * (p.stockCount ?? 10)),
      0
    );
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => (p.stockCount ?? 0) <= 8).length;
  }, [products]);

  // Open modal for new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      slug: "",
      category: "backpacks",
      price: 3500,
      salePrice: undefined,
      description: "",
      featuresText: "Fits up to a 15-inch laptop\nSpacious compartment\nDurable construction",
      stockCount: 12,
      inStock: true,
      isFeatured: false,
      isNew: true,
      selectedImages: ["/images/bagpack 1.jpg"],
      customImageUrl: "",
      sizesText: "One Size",
      colors: [
        { name: "Black", hex: "#1a1a1a" },
        { name: "Blue", hex: "#1e56a0" },
      ],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice,
      description: product.description,
      featuresText: product.features.join("\n"),
      stockCount: product.stockCount ?? 10,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      selectedImages: product.images,
      customImageUrl: "",
      sizesText: product.sizes ? product.sizes.join(", ") : "",
      colors: product.colors ?? [{ name: "Standard", hex: "#1a1a1a" }],
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const features = formData.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const sizes = formData.sizesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSlug = formData.slug.trim()
      ? slugify(formData.slug)
      : slugify(formData.name);

    let images = [...formData.selectedImages];
    if (formData.customImageUrl.trim() && !images.includes(formData.customImageUrl.trim())) {
      images.push(formData.customImageUrl.trim());
    }
    if (images.length === 0) {
      images = ["/images/bagpack 1.jpg"];
    }

    if (editingProductId) {
      // Update
      updateProduct(editingProductId, {
        name: formData.name,
        slug: generatedSlug,
        category: formData.category,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        description: formData.description,
        features,
        stockCount: Number(formData.stockCount),
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        images,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: formData.colors.length > 0 ? formData.colors : undefined,
      });
    } else {
      // Add new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: generatedSlug,
        category: formData.category,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        description: formData.description,
        features,
        stockCount: Number(formData.stockCount),
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        images,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: formData.colors.length > 0 ? formData.colors : undefined,
      };
      addProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  // Color variant helper in form
  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "New Color", hex: "#555555" }],
    }));
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleColorChange = (
    index: number,
    field: "name" | "hex" | "image",
    value: string
  ) => {
    setFormData((prev) => {
      const nextColors = [...prev.colors];
      nextColors[index] = { ...nextColors[index], [field]: value };
      return { ...prev, colors: nextColors };
    });
  };

  if (!mounted) {
    return (
      <div className="flex w-full h-full min-h-[85vh] bg-slate-50 items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 bg-slate-200 rounded-xl" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full min-h-[85vh] bg-slate-50 font-sans">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-5 shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-[#B85C6E] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              M
            </div>
            <div>
              <div className="font-extrabold text-white text-sm tracking-wide">
                Moments CMS
              </div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Tom Mboya St &bull; Nairobi
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("products")}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "products"
                  ? "bg-[#B85C6E] text-white shadow-md shadow-[#B85C6E]/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4" />
                <span>Products Catalog</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "orders"
                  ? "bg-[#B85C6E] text-white shadow-md shadow-[#B85C6E]/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4" />
                <span>Customer Orders</span>
              </div>
              {orders.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "categories"
                  ? "bg-[#B85C6E] text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Layers className="h-4 w-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "analytics"
                  ? "bg-[#B85C6E] text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Inventory Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                activeTab === "settings"
                  ? "bg-[#B85C6E] text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom options */}
        <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#D4899A]" />
              <span>View Live Storefront</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </Link>

          <button
            onClick={() => {
              if (confirm("Reset products to initial Moments Nairobi docx catalog?")) {
                resetToDefaults();
              }
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Restore Default Catalog</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CMS CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* TAB 1: PRODUCTS CMS */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Header + Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Product Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Add, edit, manage stock &amp; pricing for Moments Nairobi collection
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#B85C6E] hover:bg-[#9A4A5A] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#B85C6E]/20 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Products
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mt-1">
                  {products.length}
                </div>
                <div className="text-[10px] text-green-600 font-semibold mt-0.5">
                  ✓ Available in Storefront
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Est. Inventory Value
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mt-1">
                  {formatPrice(totalValuation)}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  Across all units in stock
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Low Stock Items
                </div>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">
                  {lowStockCount}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                  Stock ≤ 8 units
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Categories Active
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mt-1">
                  {CATEGORIES.length}
                </div>
                <div className="text-[10px] text-purple-600 font-semibold mt-0.5">
                  Backpacks, Jeans, Bags...
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#B85C6E]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
                >
                  <option value="all">All Stock Status</option>
                  <option value="inStock">In Stock Only</option>
                  <option value="lowStock">Low Stock (≤ 8)</option>
                </select>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Variants</th>
                      <th className="py-3.5 px-4">Badges</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Product Thumbnail + Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">
                                {p.name}
                              </div>
                              <div className="text-gray-400 text-[11px] font-mono">
                                /{p.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 font-semibold text-gray-600 capitalize">
                          {p.category.replace("-", " ")}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-gray-900">
                            {formatPrice(p.salePrice ?? p.price)}
                          </div>
                          {p.salePrice && (
                            <div className="text-[10px] text-gray-400 line-through">
                              {formatPrice(p.price)}
                            </div>
                          )}
                        </td>

                        {/* Stock status */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                !p.inStock
                                  ? "bg-red-500"
                                  : (p.stockCount ?? 0) <= 8
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              )}
                            />
                            <span className="font-bold text-gray-800">
                              {p.stockCount ?? 10} units
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 block">
                            {p.inStock ? "Active" : "Disabled"}
                          </span>
                        </td>

                        {/* Variants */}
                        <td className="py-3.5 px-4 text-gray-500">
                          {p.colors && p.colors.length > 0 && (
                            <div className="flex items-center gap-1 mb-1">
                              {p.colors.slice(0, 3).map((c) => (
                                <span
                                  key={c.name}
                                  className="h-3 w-3 rounded-full border border-gray-200 inline-block"
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                              {p.colors.length > 3 && (
                                <span className="text-[10px] text-gray-400 font-semibold">
                                  +{p.colors.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          {p.sizes && (
                            <div className="text-[10px] text-gray-600 font-bold">
                              Sizes: {p.sizes.join(", ")}
                            </div>
                          )}
                        </td>

                        {/* Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {p.isNew && (
                              <span className="px-2 py-0.5 rounded-full bg-[#B85C6E]/10 text-[#B85C6E] text-[10px] font-bold">
                                NEW
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                FEATURED
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              title="View on Storefront"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(p)}
                              title="Edit Product"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete product "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              title="Delete Product"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-gray-400 text-sm">
                  No products found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGER */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Customer Orders &amp; Inquiries
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Real-time orders received from WhatsApp &amp; website checkout
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Order Ref</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Delivery To</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        #{ord.orderNumber}
                        <div className="text-[10px] text-gray-400 font-normal">
                          {ord.createdAt}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">
                          {ord.customerName}
                        </div>
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {ord.customerPhone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800">
                          {ord.deliveryZone}
                        </span>
                        <div className="text-[11px] text-gray-500 line-clamp-1">
                          {ord.deliveryAddress}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-gray-700">
                              &bull; {it.name}{" "}
                              {it.color && <span className="text-gray-400">({it.color})</span>}{" "}
                              &times; {it.quantity}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-gray-900 text-sm">
                        {formatPrice(ord.total)}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className={cn(
                            "text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer",
                            ord.status === "Pending" && "bg-amber-50 text-amber-800 border-amber-200",
                            ord.status === "Confirmed" && "bg-blue-50 text-blue-800 border-blue-200",
                            ord.status === "Dispatched" && "bg-purple-50 text-purple-800 border-purple-200",
                            ord.status === "Delivered" && "bg-green-50 text-green-800 border-green-200",
                            ord.status === "Cancelled" && "bg-red-50 text-red-800 border-red-200"
                          )}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered &amp; Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={generateWhatsAppLink(
                              ord.customerPhone,
                              `Hi ${ord.customerName}! 👋 This is Moments Nairobi regarding your order #${ord.orderNumber}. We have updated your order status to "${ord.status}".`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-bold flex items-center gap-1 text-[11px]"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove order #${ord.orderNumber}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Category Manager
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Categories show as Instagram story circles &amp; navigation filters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4"
                  >
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-lg font-bold text-gray-900">
                          {cat.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 font-bold text-xs text-gray-600">
                          {count} items
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Store Analytics
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Inventory valuation and sales breakdown for Twilight Suites shop
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Category Distribution
                </h3>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => {
                    const count = products.filter((p) => p.category === cat.slug).length;
                    const percent = Math.round((count / products.length) * 100);
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{cat.name}</span>
                          <span>{count} products ({percent}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#B85C6E] h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Price Tiers Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Under KES 2,000 (Shorts, Tees, Wallets):</span>
                    <span className="font-bold text-gray-900">
                      {products.filter((p) => p.price < 2000).length} items
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>KES 2,000 – 3,500 (Crossbody, Jeans, Shackets):</span>
                    <span className="font-bold text-gray-900">
                      {products.filter((p) => p.price >= 2000 && p.price <= 3500).length} items
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>KES 4,000 – 4,500 (Designer &amp; Goyard Backpacks):</span>
                    <span className="font-bold text-gray-900">
                      {products.filter((p) => p.price >= 4000).length} items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Store Settings
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Configure contact details, address &amp; delivery parameters
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Store Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={STORE_INFO.name}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={STORE_INFO.phone}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-green-700"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 font-semibold mb-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${STORE_INFO.address} (${STORE_INFO.addressDetail})`}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Delivery Zones
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b">
                  <span>Nairobi CBD (Same day dispatch):</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Greater Nairobi (Rider delivery):</span>
                  <span className="font-bold text-gray-900">KES 300</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Rest of Kenya (Parcel courier):</span>
                  <span className="font-bold text-gray-900">KES 500</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-gray-400">
                  Fill in product details, variants, images &amp; pricing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 flex-1">
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Goyard-Style Luxury Backpack"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#B85C6E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#B85C6E]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Sale Price (KES)
                  </label>
                  <input
                    type="number"
                    min="100"
                    placeholder="Optional sale price"
                    value={formData.salePrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salePrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stockCount}
                    onChange={(e) =>
                      setFormData({ ...formData, stockCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Badges / Status Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-gray-50 rounded-xl text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-[#B85C6E] h-4 w-4"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-[#B85C6E] h-4 w-4"
                  />
                  <span>Mark as &quot;New Drop&quot;</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#B85C6E] h-4 w-4"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Spacious luxury backpack fitting 15-inch laptop..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Features bullets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Fits 15-inch laptop&#10;Durable leather trim&#10;Multiple compartments"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Sizes Available (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.sizesText}
                  onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
                  placeholder="e.g. 32, 34, 36, 38 or M, L, XL or One Size"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              {/* Color variants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Color Variants
                  </label>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-[11px] font-bold text-[#B85C6E] hover:underline"
                  >
                    + Add Color
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.colors.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                        className="h-8 w-8 rounded-lg border border-gray-200 p-0.5 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                        placeholder="Color name (e.g. Blue)"
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                      />
                      {formData.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Product Photos (Click to toggle)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {AVAILABLE_SAMPLE_IMAGES.map((img) => {
                    const isSelected = formData.selectedImages.includes(img);
                    return (
                      <button
                        key={img}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedImages: isSelected
                              ? prev.selectedImages.filter((i) => i !== img)
                              : [...prev.selectedImages, img],
                          }));
                        }}
                        className={cn(
                          "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                          isSelected
                            ? "border-[#B85C6E] ring-2 ring-[#B85C6E]/30 scale-105"
                            : "border-gray-200 opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={img}
                          alt="thumbnail"
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B85C6E] hover:bg-[#9A4A5A] text-white text-xs font-bold shadow-md transition-colors"
                >
                  {editingProductId ? "Update Product" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
