"use client";

import { useProductsStore } from "@/stores/products-store";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { STORE_INFO, STORE_HOURS } from "@/lib/constants";
import { POLICIES } from "@/config/policies";

export default function Footer() {
  const categories = useProductsStore((state) => state.categories);
  const shopLinks = [
    { label: "Shop All", href: "/shop" },
    ...categories.map(({ name, slug }) => ({ label: name, href: `/shop?category=${slug}` })),
  ];
  const currentYear = 2026;

  return (
    <footer className="w-full bg-[#111111] text-[#E4E0D8] border-t border-[#111111]">
      {/* Main 4-column grid */}
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Reversed Logo & Factual Sentence */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
              aria-label="Moments Nairobi home"
            >
              <Image
                src="/brand/logo-full-white.svg"
                alt="Moments Nairobi"
                width={140}
                height={38}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[#6B6B66] max-w-xs">
              Curated men&apos;s bags, backpacks, clothing, and accessories based in
              Nairobi CBD with nationwide delivery.
            </p>
            <div className="pt-2">
              <a
                href={STORE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#E4E0D8] hover:text-[#BB4C6C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
              >
                Instagram: @momentsnairobi
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#6B6B66] mb-4">
              Shop
            </h2>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#E4E0D8] hover:text-white transition-colors duration-200 py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#6B6B66] mb-4">
              Contact
            </h2>
            <ul className="space-y-2.5 text-sm text-[#E4E0D8]">
              <li>
                <a
                  href={`tel:+254${STORE_INFO.phone.replace(/^0/, "")}`}
                  className="hover:text-white transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
                >
                  Phone: 0702 947 981
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="hover:text-white transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C]"
                >
                  {STORE_INFO.email}
                </a>
              </li>
              <li className="pt-1 text-[#6B6B66] leading-relaxed">
                Twilight Suites, 4th Floor, Shop F4-08<br />
                Tom Mboya Street, Nairobi CBD
              </li>
            </ul>
          </div>

          {/* Column 4: Store Hours (From ONE shared constant) */}
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#6B6B66] mb-4">
              Store Hours
            </h2>
            <ul className="space-y-2 text-sm text-[#E4E0D8]">
              <li>{STORE_HOURS.weekdays}</li>
              <li>{STORE_HOURS.saturday}</li>
              <li className="text-[#6B6B66]">{STORE_HOURS.sunday}</li>
              <li className="pt-3 text-xs text-[#6B6B66] leading-relaxed border-t border-white/10 mt-3">
                Free pickup at Twilight Suites F4-08. Same-day dispatch across Kenya.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#111111]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B6B66]">
            &copy; {currentYear} Moments Nairobi. Twilight Suites F4-08. All rights reserved.
          </p>
          {/* Driven by policies.ts; empty until Pesapal is live */}
          {POLICIES.payments.acceptedLabel ? (
            <p className="text-xs text-[#6B6B66]">
              {POLICIES.payments.acceptedLabel}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
