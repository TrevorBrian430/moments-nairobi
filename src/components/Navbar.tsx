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
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?category=new-arrivals" },
  { label: "Bags", href: "/shop?category=bags" },
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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ====== Announcement bar ====== */}
      <div className="bg-gray-900 text-white text-xs text-center py-2 px-4">
        🚚 Free delivery in Nairobi CBD • Countrywide shipping available
      </div>

      {/* ====== Main navbar ====== */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white border-b transition-shadow duration-300",
          scrolled ? "shadow-md border-gray-200" : "border-gray-100"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* — Mobile hamburger — */}
          <button
            aria-label="Open menu"
            className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-[#B85C6E] transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* — Logo — */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Moments Nairobi"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* — Desktop nav links — */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-gray-700 hover:text-[#B85C6E] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#B85C6E] after:transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* — Right icons — */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-[#B85C6E] transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* WhatsApp */}
            <a
              href="https://wa.me/254702947981"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden sm:block p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative p-2 text-gray-700 hover:text-[#B85C6E] transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B85C6E] text-[10px] font-bold text-white">
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
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Moments Nairobi"
              width={100}
              height={34}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            aria-label="Close menu"
            className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#B85C6E] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 px-4 py-4 space-y-3">
          <a
            href="https://wa.me/254702947981"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          <a
            href="tel:+254702947981"
            className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#B85C6E] transition-colors"
          >
            <Phone className="h-4 w-4" />
            0702 947 981
          </a>
        </div>
      </aside>
    </>
  );
}
