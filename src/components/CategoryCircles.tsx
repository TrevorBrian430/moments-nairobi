"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryCircles() {
  return (
    <section className="w-full py-6">
      <div
        className={
          "flex items-start gap-5 overflow-x-auto px-4 pb-2 scrollbar-hide " +
          "sm:justify-center sm:overflow-x-visible sm:px-0"
        }
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2"
          >
            {/* Circle image */}
            <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-[#B85C6E] group-hover:ring-offset-2 sm:h-24 sm:w-24">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="96px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Label */}
            <span className="max-w-[5rem] text-center text-xs font-medium text-neutral-700 transition-colors group-hover:text-[#B85C6E] sm:max-w-[6rem] sm:text-sm">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
