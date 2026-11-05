"use client";

import { Sparkles } from "lucide-react";

interface MarqueeBannerProps {
  variant?: "dark" | "brand" | "light";
}

export default function MarqueeBanner({ variant = "dark" }: MarqueeBannerProps) {
  const items = [
    "NEW DROPS DAILY",
    "FREE CBD PICKUP @ TWILIGHT SUITES F4-08",
    "FAST COUNTRYWIDE DISPATCH",
    "100% QUALITY CURATED FITS",
    "LIPA NA M-PESA ACCEPTED",
    "DIRECT WHATSAPP ORDERS: 0702 947 981",
    "STATEMENT LUXURY BACKPACKS",
    "DESIGNER CROSSBODY BAGS",
  ];

  const bgStyles =
    variant === "brand"
      ? "bg-[#B85C6E] text-white border-y border-[#9A4A5A]"
      : variant === "light"
      ? "bg-neutral-100 text-gray-900 border-y border-gray-200"
      : "bg-gray-950 text-white border-y border-white/10";

  return (
    <div
      className={`w-full overflow-hidden py-3 text-xs sm:text-sm font-extrabold tracking-widest uppercase select-none ${bgStyles}`}
      aria-label="Moments Nairobi Announcements"
    >
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* First repetition */}
        {items.map((item, idx) => (
          <div key={`m1-${idx}`} className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
              <span>{item}</span>
            </span>
            <span className="text-amber-400/80 font-black text-sm">✦</span>
          </div>
        ))}

        {/* Second repetition for infinite smooth loop */}
        {items.map((item, idx) => (
          <div key={`m2-${idx}`} className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
              <span>{item}</span>
            </span>
            <span className="text-amber-400/80 font-black text-sm">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
