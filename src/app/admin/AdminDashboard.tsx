"use client";

import { createAdminRequestId } from "./request-id";

import { useState, useMemo } from "react";
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
  X,
  ExternalLink,
  Eye,
  RefreshCw,
  LogOut,
  Menu,
} from "lucide-react";
import { type Category, type Product } from "@/lib/constants";
import { formatPrice, slugify, cn } from "@/lib/utils";
import type { ServerOrder } from "@/lib/server-orders";
import type { DeliveryTown } from "@/config/policies";
import OrdersPanel from "./OrdersPanel";
import DeliverySettings from "./DeliverySettings";
import Overview from "./Overview";
import CategoriesPanel from "./CategoriesPanel";

async function adminRequest(action?: object) {
  const response = await fetch("/api/admin/store", action ? {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(action),
  } : { cache: "no-store" });
  if (response.status === 401) window.location.reload();
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not load store data.");
  return data as { categories?: Category[]; products?: Product[]; orders?: ServerOrder[]; towns?: DeliveryTown[] };
}

type AdminTab = "products" | "orders" | "categories" | "analytics" | "settings";

const tabs = [
  { id: "analytics", label: "Overview", icon: BarChart3 },
  { id: "products", label: "Product CMS", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "settings", label: "Store settings", icon: Settings },
] as const;

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

export default function AdminDashboard({ initialCategories, initialProducts, initialOrders, initialTowns }: {
  initialCategories: Category[];
  initialProducts: Product[];
  initialOrders: ServerOrder[];
  initialTowns: DeliveryTown[];
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(tab: AdminTab) {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo(0, 0);
    if (tab === "orders" && !busy) void sync();
  }
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [towns, setTowns] = useState(initialTowns);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean }>();
  const [originalStock, setOriginalStock] = useState<number>();

  async function sync(action?: object, message?: string) {
    setBusy(true);
    setFeedback(undefined);
    try {
      const data = await adminRequest(action);
      if (data.categories) {
        const categories = data.categories;
        setCategories(categories);
        setCategoryFilter((selected) => categories.some(({ slug }) => slug === selected) ? selected : "all");
      }
      if (data.products) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.towns) setTowns(data.towns);
      if (message) setFeedback({ message });
      return true;
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : "Could not connect to the store.", error: true });
      return false;
    } finally {
      setBusy(false);
    }
  }

  // Search & Filter state for products
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock" | "unavailable">("all");

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
    category: initialCategories[0]?.slug ?? "",
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
      if (stockFilter === "inStock" && (!p.inStock || (p.stockCount ?? 10) <= 0))
        return false;
      if (stockFilter === "unavailable" && p.inStock && (p.stockCount ?? 10) > 0) return false;
      if (stockFilter === "lowStock" && (p.stockCount ?? 10) > 8)
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
    return products.filter((p) => (p.stockCount ?? 10) <= 8).length;
  }, [products]);

  // Open modal for new product
  const handleOpenAddModal = () => {
    setFeedback(undefined);
    setEditingProductId(null);
    setFormData({
      name: "",
      slug: "",
      category: categories.find(({ slug }) => slug === categoryFilter)?.slug ?? categories[0]?.slug ?? "",
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
    setFeedback(undefined);
    setOriginalStock(product.stockCount ?? 10);
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
      colors: product.colors ?? [],
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

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

    const product: Product = {
      id: editingProductId ?? `prod-${createAdminRequestId()}`,
      name: formData.name,
      slug: generatedSlug,
      category: formData.category,
      price: formData.price,
      salePrice: formData.salePrice,
      description: formData.description,
      features,
      stockCount: formData.stockCount,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,
      isNew: formData.isNew,
      images,
      sizes: sizes.length ? sizes : undefined,
      colors: formData.colors.length ? formData.colors.map(({ name, hex, image }) => ({
        name: name.trim(), hex, image: image?.trim() || undefined,
      })) : undefined,
    };
    if (await sync({ action: "saveProduct", product, editing: !!editingProductId, expectedStock: originalStock }, "Product saved.")) {
      setIsModalOpen(false);
    }
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

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col bg-[#35221b] text-[#f6e8dc] lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 lg:px-5 lg:py-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#97593d] font-heading text-xl font-semibold text-white">M</span>
            <div>
              <p className="font-heading text-base font-semibold leading-tight text-[#fff4e8]">Moments Nairobi</p>
              <p className="mt-0.5 text-xs text-[#d9baaa]">Store admin</p>
            </div>
          </div>
          <button type="button" aria-expanded={menuOpen} aria-controls="admin-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(!menuOpen)} className="grid size-11 shrink-0 place-items-center rounded-[9px] border border-[#705040] lg:hidden">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        <div id="admin-navigation" className={cn("flex-1 flex-col justify-between gap-6 px-4 pb-4 lg:flex", menuOpen ? "flex" : "hidden")}>
          <nav aria-label="Admin navigation" className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => navigate(id)} aria-current={activeTab === id ? "page" : undefined}
                className={cn("flex min-h-11 items-center gap-2.5 rounded-[9px] px-3 text-left text-sm font-medium", activeTab === id
                  ? "bg-[#895139] text-white" : "text-[#ecd9cb] hover:bg-[#503227]")}>
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-1 border-t border-[#624335] pt-3 text-sm lg:grid-cols-1">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-[9px] px-3 hover:bg-[#503227]">
              <ExternalLink size={16} className="shrink-0" aria-hidden="true" /> Storefront
            </Link>
            <button disabled={busy} onClick={() => void sync()} className="flex min-h-11 items-center gap-2 rounded-[9px] px-3 text-left hover:bg-[#503227] disabled:opacity-60">
              <RefreshCw size={16} className="shrink-0" aria-hidden="true" /> Refresh data
            </button>
            <button onClick={async () => {
              try {
                const response = await fetch("/api/admin/session", { method: "DELETE" });
                if (!response.ok) throw new Error();
                window.location.reload();
              } catch {
                setFeedback({ message: "Could not sign out. Try again.", error: true });
              }
            }} className="flex min-h-11 items-center gap-2 rounded-[9px] px-3 text-left hover:bg-[#503227]">
              <LogOut size={16} className="shrink-0" aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 space-y-5 p-4 sm:p-6 xl:p-8">
        {!isModalOpen && feedback && (
          <p role={feedback.error ? "alert" : "status"} className={cn("rounded-[9px] border p-3 text-sm", feedback.error ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800")}>{feedback.message}</p>
        )}
        {/* TAB 1: PRODUCTS CMS */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Header + Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#322019] tracking-tight">
                  Product Management
                </h1>
                <p className="text-xs sm:text-sm text-[#705648] mt-1">
                  Add, edit, manage stock &amp; pricing for Moments Nairobi collection
                </p>
              </div>

              <button
                type="button"
                disabled={busy || !categories.length}
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#895139] hover:bg-[#733d29] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#895139]/20 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#fffaf5] rounded-[16px] p-4 border border-[#e4d6ca] shadow-sm">
                <div className="text-[11px] font-bold text-[#795d4d] uppercase tracking-wider">
                  Total Products
                </div>
                <div className="text-2xl font-extrabold text-[#322019] mt-1">
                  {products.length}
                </div>
                <div className="text-[10px] text-green-600 font-semibold mt-0.5">
                  In catalog
                </div>
              </div>

              <div className="bg-[#fffaf5] rounded-[16px] p-4 border border-[#e4d6ca] shadow-sm">
                <div className="text-[11px] font-bold text-[#795d4d] uppercase tracking-wider">
                  Est. Inventory Value
                </div>
                <div className="text-2xl font-extrabold text-[#322019] mt-1">
                  {formatPrice(totalValuation)}
                </div>
                <div className="text-[10px] text-[#705648] font-semibold mt-0.5">
                  Across all units in stock
                </div>
              </div>

              <div className="bg-[#fffaf5] rounded-[16px] p-4 border border-[#e4d6ca] shadow-sm">
                <div className="text-[11px] font-bold text-[#795d4d] uppercase tracking-wider">
                  Low Stock Items
                </div>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">
                  {lowStockCount}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                  Stock ≤ 8 units
                </div>
              </div>

              <div className="bg-[#fffaf5] rounded-[16px] p-4 border border-[#e4d6ca] shadow-sm">
                <div className="text-[11px] font-bold text-[#795d4d] uppercase tracking-wider">
                  Categories Active
                </div>
                <div className="text-2xl font-extrabold text-[#322019] mt-1">
                  {categories.length}
                </div>
                <div className="text-[10px] text-purple-600 font-semibold mt-0.5">
                  Backpacks, Jeans, Bags...
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-[#fffaf5] rounded-[16px] p-4 border border-[#e4d6ca] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#795d4d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-4 py-2 border border-[#d9c2b0] rounded-[12px] text-xs focus:outline-none focus:ring-1 focus:ring-[#895139]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#f8efe7] border border-[#d9c2b0] rounded-[12px] px-3 py-2 text-xs font-semibold text-[#594033] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as typeof stockFilter)}
                  className="bg-[#f8efe7] border border-[#d9c2b0] rounded-[12px] px-3 py-2 text-xs font-semibold text-[#594033] focus:outline-none"
                >
                  <option value="all">All Stock Status</option>
                  <option value="inStock">In Stock Only</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="lowStock">Low Stock (≤ 8)</option>
                </select>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-[#fffaf5] rounded-[16px] border border-[#e4d6ca] shadow-sm overflow-hidden">
              <div className="admin-table-frame overflow-x-auto">
                <table className="admin-table w-full text-left text-xs" role="table">
                  <thead role="rowgroup" className="bg-[#f4ebe1] border-b border-[#e4d6ca] text-[#705648] font-bold uppercase tracking-wider text-[10px]">
                    <tr role="row">
                      <th role="columnheader" scope="col" className="py-3.5 px-4">Product</th>
                      <th role="columnheader" scope="col" className="py-3.5 px-4">Category</th>
                      <th role="columnheader" scope="col" className="py-3.5 px-4">Price</th>
                      <th role="columnheader" scope="col" className="py-3.5 px-4">Stock</th>
                      <th role="columnheader" scope="col" className="py-3.5 px-4">Variants</th>
                      <th role="columnheader" scope="col" className="py-3.5 px-4">Badges</th>
                      <th role="columnheader" scope="col" className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup" className="divide-y divide-[#eadbd0]">
                    {filteredProducts.map((p) => (
                      <tr role="row" key={p.id} className="hover:bg-[#f4ebe1]/60 transition-colors">
                        {/* Product Thumbnail + Name */}
                        <td role="cell" className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-[12px] overflow-hidden bg-[#efe1d6] shrink-0 border border-[#d9c2b0]">
                              <Image
                                src={p.images[0]}
                                unoptimized={(p.images[0]).startsWith("https://")}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#322019] text-sm">
                                {p.name}
                              </div>
                              <div className="text-[#795d4d] text-[11px] font-mono">
                                /{p.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td role="cell" data-label="Category" className="py-3.5 px-4 font-semibold text-[#705648] capitalize">
                          {categories.find(({ slug }) => slug === p.category)?.name ?? p.category}
                        </td>

                        {/* Price */}
                        <td role="cell" data-label="Price" className="py-3.5 px-4">
                          <div className="font-extrabold text-[#322019]">
                            {formatPrice(p.salePrice ?? p.price)}
                          </div>
                          {p.salePrice && (
                            <div className="text-[10px] text-[#795d4d] line-through">
                              {formatPrice(p.price)}
                            </div>
                          )}
                        </td>

                        {/* Stock status */}
                        <td role="cell" data-label="Stock" className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                !p.inStock
                                  ? "bg-red-500"
                                  : (p.stockCount ?? 10) <= 8
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              )}
                            />
                            <span className="font-bold text-[#493128]">
                              {p.stockCount ?? 10} units
                            </span>
                          </div>
                          <span className="text-[10px] text-[#795d4d] block">
                            {p.inStock ? "Active" : "Disabled"}
                          </span>
                        </td>

                        {/* Variants */}
                        <td role="cell" data-label="Variants" className="py-3.5 px-4 text-[#705648]">
                          {p.colors && p.colors.length > 0 && (
                            <div className="flex items-center gap-1 mb-1">
                              {p.colors.slice(0, 3).map((c) => (
                                <span
                                  key={c.name}
                                  className="h-3 w-3 rounded-full border border-[#d9c2b0] inline-block"
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                              {p.colors.length > 3 && (
                                <span className="text-[10px] text-[#795d4d] font-semibold">
                                  +{p.colors.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          {p.sizes && (
                            <div className="text-[10px] text-[#705648] font-bold">
                              Sizes: {p.sizes.join(", ")}
                            </div>
                          )}
                        </td>

                        {/* Badges */}
                        <td role="cell" data-label="Badges" className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {p.isNew && (
                              <span className="px-2 py-0.5 rounded-full bg-[#895139]/10 text-[#895139] text-[10px] font-bold">
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
                        <td role="cell" data-wide className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              aria-label={`View ${p.name} on storefront`}
                              title="View on Storefront"
                              className="inline-flex size-11 items-center justify-center rounded-[9px] text-[#795d4d] hover:text-[#594033] hover:bg-[#efe1d6]"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleOpenEditModal(p)}
                              aria-label={`Edit ${p.name}`}
                              title="Edit Product"
                              className="inline-flex size-11 items-center justify-center rounded-[9px] text-[#733d29] hover:bg-[#efe1d6]"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!busy && confirm(`Delete product "${p.name}"?`)) {
                                  void sync({ action: "deleteProduct", id: p.id }, "Product deleted.");
                                }
                              }}
                              aria-label={`Delete ${p.name}`}
                              title="Delete Product"
                              className="inline-flex size-11 items-center justify-center rounded-[9px] text-red-500 hover:bg-red-50"
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
                <div className="p-12 text-center text-[#795d4d] text-sm">
                  No products found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <OrdersPanel orders={orders} products={products} categories={categories} towns={towns} busy={busy}
            create={(source, order) => sync({ action: "createOrder", source, order }, "Order recorded.")}
            update={(id, changes) => sync({ action: "updateOrder", id, ...changes }, "Order updated.")} />
        )}

        {activeTab === "categories" && (
          <CategoriesPanel categories={categories} products={products} busy={busy}
            save={(category) => sync({ action: "saveCategory", category }, "Category saved.")}
            remove={(id) => sync({ action: "deleteCategory", id }, "Category deleted.")}
            viewProducts={(slug) => {
              setCategoryFilter(slug);
              setSearchQuery("");
              setStockFilter("all");
              navigate("products");
            }} />
        )}

        {activeTab === "analytics" && (
          <Overview categories={categories} products={products} orders={orders}
            showOrders={() => navigate("orders")}
            showLowStock={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStockFilter("lowStock");
              navigate("products");
            }}
            editProduct={handleOpenEditModal} />
        )}

        {activeTab === "settings" && (
          <DeliverySettings towns={towns} busy={busy}
            save={(fees) => sync({ action: "deliveryFees", fees }, "Courier fees saved.")} />
        )}
      </main>

      {/* 3. ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div role="dialog" aria-modal="true" aria-label={editingProductId ? "Edit product" : "Add product"} className="bg-[#fffaf5] rounded-[20px] max-w-2xl w-full max-h-[calc(100dvh-1rem)] sm:max-h-[90dvh] overflow-y-auto shadow-2xl border border-[#e4d6ca] flex flex-col">
            {feedback?.error && <p role="alert" className="m-4 rounded-[9px] bg-red-50 p-3 text-sm text-red-800">{feedback.message}</p>}
            {/* Modal Header */}
            <div className="p-6 border-b border-[#e4d6ca] flex items-center justify-between sticky top-0 bg-[#fffaf5]/95 backdrop-blur-md z-10">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#322019]">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-[#795d4d]">
                  Fill in product details, variants, images &amp; pricing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close product editor"
                className="p-2 rounded-full text-[#795d4d] hover:text-[#594033] hover:bg-[#efe1d6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 space-y-6 p-4 sm:p-6">
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Goyard-Style Luxury Backpack"
                    className="w-full px-3.5 py-2.5 border border-[#d9c2b0] rounded-[12px] text-xs font-medium focus:ring-1 focus:ring-[#895139]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#d9c2b0] rounded-[12px] text-xs font-medium focus:ring-1 focus:ring-[#895139]"
                  >
                    {categories.map((c) => (
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
                  <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-[#d9c2b0] rounded-[12px] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
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
                    className="w-full px-3.5 py-2.5 border border-[#d9c2b0] rounded-[12px] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
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
                    className="w-full px-3.5 py-2.5 border border-[#d9c2b0] rounded-[12px] text-xs font-bold"
                  />
                </div>
              </div>

              {/* Badges / Status Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-[#f8efe7] rounded-[12px] text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-[#895139] h-4 w-4"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-[#895139] h-4 w-4"
                  />
                  <span>Mark as &quot;New Drop&quot;</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#895139] h-4 w-4"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Spacious luxury backpack fitting 15-inch laptop..."
                  className="w-full px-3.5 py-2 border border-[#d9c2b0] rounded-[12px] text-xs resize-none"
                />
              </div>

              {/* Features bullets */}
              <div>
                <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
                  Product Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Fits 15-inch laptop&#10;Durable leather trim&#10;Multiple compartments"
                  className="w-full px-3.5 py-2 border border-[#d9c2b0] rounded-[12px] text-xs"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-1">
                  Sizes Available (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.sizesText}
                  onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
                  placeholder="e.g. 32, 34, 36, 38 or M, L, XL or One Size"
                  className="w-full px-3.5 py-2.5 border border-[#d9c2b0] rounded-[12px] text-xs"
                />
              </div>

              {/* Color variants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#594033] uppercase tracking-wider">
                    Color Variants
                  </label>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-[11px] font-bold text-[#895139] hover:underline"
                  >
                    + Add Color
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.colors.map((c, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                        className="h-8 w-8 rounded-[9px] border border-[#d9c2b0] p-0.5 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                        placeholder="Color name (e.g. Blue)"
                        className="min-w-0 flex-1 px-3 py-1.5 border border-[#d9c2b0] rounded-[9px] text-xs"
                      />
                      <input
                        aria-label={`Photo URL for ${c.name || "color"}`}
                        type="text"
                        value={c.image ?? ""}
                        onChange={(e) => handleColorChange(idx, "image", e.target.value)}
                        placeholder="Variant image URL"
                        className="min-w-0 flex-1 rounded-[9px] border border-[#d9c2b0] px-3 py-1.5 text-xs"
                      />
                      {formData.colors.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-1 text-[#795d4d] hover:text-red-500"
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
                <label className="block text-xs font-bold text-[#594033] uppercase tracking-wider mb-2">
                  Select Product Photos (Click to toggle)
                </label>
                <label className="mb-3 block text-xs font-medium text-[#705648]">
                  Add a photo URL
                  <input type="text" value={formData.customImageUrl}
                    onChange={(event) => setFormData({ ...formData, customImageUrl: event.target.value })}
                    placeholder="https://… or /images/…"
                    className="mt-1 block min-h-10 w-full rounded-[9px] border border-[#d9c2b0] px-3 text-sm" />
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[...new Set([...formData.selectedImages, ...AVAILABLE_SAMPLE_IMAGES])].map((img) => {
                    const isSelected = formData.selectedImages.includes(img);
                    return (
                      <button
                        key={img}
                        type="button"
                        aria-label={`Photo ${img.split("/").at(-1)}`}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedImages: isSelected
                              ? prev.selectedImages.filter((i) => i !== img)
                              : [...prev.selectedImages, img],
                          }));
                        }}
                        className={cn(
                          "relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all",
                          isSelected
                            ? "border-[#895139] ring-2 ring-[#895139]/30 scale-105"
                            : "border-[#d9c2b0] opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={img}
                          unoptimized={img.startsWith("https://")}
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
              <div className="pt-4 border-t border-[#e4d6ca] flex items-center justify-end gap-3 sticky bottom-0 bg-[#fffaf5] py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#d9c2b0] text-xs font-semibold text-[#705648] hover:bg-[#f8efe7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-full bg-[#895139] hover:bg-[#733d29] text-white text-xs font-bold shadow-md transition-colors"
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
