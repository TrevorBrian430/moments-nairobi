"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";

const QUICK_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Backpacks", href: "/shop?category=backpacks" },
  { label: "Crossbody Bags", href: "/shop?category=crossbody-bags" },
  { label: "Designer Bags", href: "/shop?category=designer-bags" },
  { label: "Clothing", href: "/shop?category=clothing" },
  { label: "Accessories", href: "/shop?category=accessories" },
] as const;

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ====== Main grid ====== */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* — Brand column — */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Moments Nairobi"
                width={120}
                height={40}
                className="h-10 w-auto object-contain brightness-200"
              />
            </Link>
            <p className="text-lg font-semibold text-white tracking-wide">
              Own Your Moment
            </p>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Premium men&apos;s fashion curated for the modern Nairobi
              gentleman. Quality bags, clothing, and accessories delivered to
              your doorstep.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={STORE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-gray-800 p-2.5 text-gray-400 hover:bg-[#B85C6E] hover:text-white transition-colors"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://wa.me/254702947981"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full bg-gray-800 p-2.5 text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* — Quick Links column — */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* — Contact column — */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+254702947981"
                  className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#B85C6E]" />
                  0702 947 981
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@momentsnairobi.co.ke"
                  className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#B85C6E]" />
                  info@momentsnairobi.co.ke
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B85C6E]" />
                <span>
                  Twilight Suites, 4th Floor,
                  <br />
                  Shop 08, Tom Mboya Street
                </span>
              </li>
            </ul>
          </div>

          {/* — Newsletter / info column — */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Why Shop With Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>✓ Free delivery in Nairobi CBD</li>
              <li>✓ Countrywide shipping</li>
              <li>✓ Quality guaranteed</li>
              <li>✓ Easy M-Pesa payments</li>
              <li>✓ Responsive customer support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ====== Bottom bar ====== */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-8">
          <p className="text-xs text-gray-500">
            © {currentYear} Moments Nairobi. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-green-800/40 px-3 py-1 text-xs font-semibold text-green-400 ring-1 ring-green-700/50">
              M-Pesa
            </span>
            <span className="text-xs text-gray-500">Accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
