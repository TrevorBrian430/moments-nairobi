"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Backpacks", href: "/shop?category=backpacks" },
  { label: "Crossbody Bags", href: "/shop?category=crossbody-bags" },
  { label: "Designer Bags", href: "/shop?category=designer-bags" },
  { label: "Clothing", href: "/shop?category=clothing" },
  { label: "Accessories", href: "/shop?category=accessories" },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.totalItems());

  /* ---------- sticky shadow on scroll ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- lock body scroll when drawer open ---------- */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ====== Announcement bar ====== */}
      <div className="bg-gray-950 text-white text-[11px] sm:text-xs text-center py-2 px-3 tracking-wide border-b border-white/5 font-medium relative z-40">
        🚚 Free CBD Delivery &bull; Countrywide Shipping &bull; Order via WhatsApp:{" "}
        <a
          href="https://wa.me/254702947981"
          className="underline font-bold text-green-400 hover:text-green-300"
        >
          0702 947 981
        </a>
      </div>

      {/* ====== Main navbar ====== */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-300",
          scrolled ? "shadow-md border-gray-200" : "border-gray-100"
        )}
      >
        <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* — Mobile hamburger button — */}
          <button
            type="button"
            aria-label="Open navigation menu"
            className="lg:hidden p-2.5 -ml-2 text-gray-800 hover:text-[#B85C6E] transition-colors cursor-pointer touch-manipulation z-20 active:scale-95"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6 pointer-events-none" />
          </button>

          {/* — Logo — */}
          <Link href="/" className="flex items-center gap-2 shrink-0 py-1">
            <Image
              src="/images/logo.png"
              alt="Moments Nairobi"
              width={160}
              height={50}
              className="h-9 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* — Desktop nav links — */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs uppercase font-bold tracking-wider text-gray-700 hover:text-[#B85C6E] transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* — Right icons — */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-[#B85C6E] transition-colors cursor-pointer touch-manipulation"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* WhatsApp */}
            <a
              href="https://wa.me/254702947981"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="p-2 text-gray-700 hover:text-green-600 transition-colors cursor-pointer touch-manipulation"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative p-2 text-gray-800 hover:text-[#B85C6E] transition-colors cursor-pointer touch-manipulation"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#B85C6E] text-[10px] font-extrabold text-white shadow-sm pointer-events-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ====== Mobile slide-in drawer ====== */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-80 max-w-[85vw] bg-white shadow-2xl transition-all duration-300 ease-in-out lg:hidden flex flex-col",
          mobileOpen
            ? "translate-x-0 pointer-events-auto visible"
            : "-translate-x-full pointer-events-none invisible"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Moments Nairobi"
              width={140}
              height={44}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer touch-manipulation"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store location tag */}
        <div className="px-5 pt-3 pb-2 text-[11px] text-gray-500 flex items-center gap-2 bg-gray-50 border-b border-gray-100">
          <MapPin className="h-3.5 w-3.5 text-[#B85C6E] shrink-0" />
          <span className="truncate">Twilight Suites F4-08, Tom Mboya St</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#B85C6E] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              Store Admin CMS &bull; Twilight Suites
            </Link>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 p-4 space-y-2.5 bg-gray-50/70">
          <a
            href="https://wa.me/254702947981"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] text-white py-3 rounded-full text-xs font-bold shadow-md hover:bg-[#20bd59] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp (0702 947 981)</span>
          </a>
          <a
            href="tel:+254702947981"
            className="flex items-center justify-center gap-2 w-full border border-gray-200 bg-white text-gray-800 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            <Phone className="h-4 w-4 text-[#B85C6E]" />
            <span>Call 0702 947 981</span>
          </a>
        </div>
      </aside>
    </>
  );
}
