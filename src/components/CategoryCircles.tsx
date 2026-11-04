"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryCircles() {
  return (
    <div className="w-full py-2">
      <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto px-1 pb-3 scrollbar-hide sm:justify-center snap-x snap-mandatory">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2 snap-start cursor-pointer active:scale-95 transition-transform"
          >
            {/* Story ring and image */}
            <div className="relative p-0.5 rounded-full ring-2 ring-gray-200 group-hover:ring-[#B85C6E] transition-all duration-300 shadow-sm">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-neutral-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Label */}
            <span className="w-20 text-center text-[11px] sm:text-xs font-bold text-gray-800 group-hover:text-[#B85C6E] transition-colors line-clamp-2 leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
