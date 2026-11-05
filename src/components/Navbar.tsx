"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, Menu, X, MapPin } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { STORE_HOURS } from "@/lib/constants";
import AnnouncementBar from "./AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Backpacks", href: "/shop?category=backpacks" },
  { label: "Crossbody Bags", href: "/shop?category=crossbody-bags" },
  { label: "Designer Bags", href: "/shop?category=designer-bags" },
  { label: "Clothing", href: "/shop?category=clothing" },
  { label: "Accessories", href: "/shop?category=accessories" },
] as const;

function DesktopNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLinkActive = (href: string) => {
    if (href === "/shop") {
      return pathname === "/shop" && !searchParams.get("category");
    }
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) return true;
    const cat = new URLSearchParams(query).get("category");
    return searchParams.get("category") === cat;
  };

  return (
    <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative text-[13px] uppercase tracking-[0.08em] font-medium py-1 transition-colors duration-200 select-none",
              active
                ? "text-[#111111] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#BB4C6C]"
                : "text-[#6B6B66] hover:text-[#111111]"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLinkActive = (href: string) => {
    if (href === "/shop") {
      return pathname === "/shop" && !searchParams.get("category");
    }
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) return true;
    const cat = new URLSearchParams(query).get("category");
    return searchParams.get("category") === cat;
  };

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between px-3 py-3 text-[13px] uppercase tracking-[0.08em] font-medium rounded-[2px] transition-colors duration-200",
              active
                ? "bg-[#F6F4F0] text-[#BB4C6C] font-semibold border-l-2 border-[#BB4C6C]"
                : "text-[#111111] hover:bg-[#F6F4F0]"
            )}
          >
            <span>{link.label}</span>
          </Link>
        );
      })}

      <div className="pt-4 mt-4 border-t border-[#E4E0D8]">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="block px-3 py-2.5 text-xs font-medium text-[#6B6B66] hover:text-[#111111] hover:bg-[#F6F4F0] rounded-[2px] transition-colors"
        >
          Store Admin CMS
        </Link>
      </div>
    </nav>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rawItemCount = useCartStore((s) => s.totalItems());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const announcement = useCartStore((s) => s.announcement);
  const itemCount = mounted ? rawItemCount : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Lock body scroll when drawer is open */
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
      <AnnouncementBar />

      <header className="sticky top-0 z-50 w-full bg-[#F6F4F0] border-b border-[#E4E0D8]">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label="Open navigation menu"
            className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] -ml-2 text-[#111111] hover:text-[#BB4C6C] transition-colors cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo (Full lockup desktop, mark only mobile) */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center min-h-[44px] py-1 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
            >
              {/* Mobile mark only */}
              <div className="lg:hidden flex items-center">
                <Image
                  src="/brand/logo-mark.svg"
                  alt="Moments Nairobi"
                  width={34}
                  height={34}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </div>
              {/* Desktop full lockup */}
              <div className="hidden lg:flex items-center">
                <Image
                  src="/brand/logo-full.svg"
                  alt="Moments Nairobi"
                  width={140}
                  height={38}
                  className="h-7 w-auto object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Centered desktop nav */}
          <Suspense
            fallback={
              <nav className="hidden lg:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <span
                    key={link.href}
                    className="text-[13px] uppercase tracking-[0.08em] font-medium text-[#6B6B66]"
                  >
                    {link.label}
                  </span>
                ))}
              </nav>
            }
          >
            <DesktopNavLinks />
          </Suspense>

          {/* Right: Search and Cart (WhatsApp icon removed as per instructions) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              aria-label="Search collection"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-[#111111] hover:text-[#BB4C6C] transition-colors cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
            >
              <Search className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Shopping cart with ${itemCount} items`}
              className="relative flex items-center justify-center min-h-[44px] min-w-[44px] text-[#111111] hover:text-[#BB4C6C] transition-colors cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-[999px] bg-[#BB4C6C] text-[10px] font-semibold text-white pointer-events-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-opacity duration-200 ease-out lg:hidden cursor-pointer"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-80 max-w-[85vw] bg-white h-full border-r border-[#E4E0D8] shadow-xl flex flex-col transition-transform duration-200 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[#E4E0D8] px-5 py-4 bg-[#F6F4F0]">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center"
          >
            <Image
              src="/brand/logo-full.svg"
              alt="Moments Nairobi"
              width={130}
              height={36}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 text-[#111111] hover:text-[#BB4C6C] transition-colors cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Physical shop location banner */}
        <div className="px-5 py-2.5 text-xs text-[#6B6B66] flex items-center gap-2 border-b border-[#E4E0D8]">
          <MapPin className="h-3.5 w-3.5 text-[#BB4C6C] shrink-0" />
          <span className="truncate">Twilight Suites F4-08, Tom Mboya St</span>
        </div>

        {/* Mobile Navigation Links */}
        <Suspense
          fallback={
            <div className="p-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="py-2 text-xs text-[#6B6B66]">
                  {link.label}
                </div>
              ))}
            </div>
          }
        >
          <MobileNavLinks onNavigate={() => setMobileOpen(false)} />
        </Suspense>

        {/* Drawer footer with store hours */}
        <div className="border-t border-[#E4E0D8] p-5 space-y-2 bg-[#F6F4F0] text-xs text-[#6B6B66]">
          <p className="font-medium text-[#111111]">Store Hours</p>
          <p>{STORE_HOURS.weekdays}</p>
          <p>{STORE_HOURS.saturday}</p>
          <p>{STORE_HOURS.sunday}</p>
        </div>
      </aside>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Accessible Live Region */}
      {announcement && (
        <div className="sr-only" role="status" aria-live="polite">
          {announcement}
        </div>
      )}
    </>
  );
}
