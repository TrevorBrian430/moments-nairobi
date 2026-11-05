"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`${className} fill-current`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const INSTA_POSTS = [
  {
    image: "/images/bagpack 1.jpg",
    caption: "The Brown Monogram Backpack in Nairobi CBD 📍",
  },
  {
    image: "/images/goyard style blue.jpg",
    caption: "Blue Goyard-Style statement piece",
  },
  {
    image: "/images/crossbody-bag.jpg",
    caption: "Everyday essentials on the move",
  },
  {
    image: "/images/shacket-white.jpg",
    caption: "Streetwear layers for Nairobi chilly mornings",
  },
  {
    image: "/images/goyard-maroon.jpg",
    caption: "Maroon chevron luxury backpack",
  },
  {
    image: "/images/shorts-tribal.jpg",
    caption: "Weekend casual fit essentials",
  },
];

export default function InstagramFeed() {
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#B85C6E]">
            <InstagramIcon className="h-4 w-4" />
            <span>@momentsnairobi</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Follow Us On Instagram
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real clients rocking Moments Nairobi fits across Kenya &bull; Tag us to be featured
          </p>
        </div>

        <a
          href={STORE_INFO.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-[#B85C6E] transition-colors border border-gray-200 hover:border-gray-900 px-4 py-2 rounded-full active:scale-95"
        >
          <span>Follow @momentsnairobi</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* 6-Photo Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {INSTA_POSTS.map((post, idx) => (
          <a
            key={idx}
            href={STORE_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 shadow-xs block"
          >
            <Image
              src={post.image}
              alt={post.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {/* Dark hover overlay with Insta logo and caption */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white text-center">
              <InstagramIcon className="h-6 w-6 text-white mb-1.5" />
              <span className="text-[10px] font-semibold line-clamp-2 leading-tight">
                {post.caption}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
