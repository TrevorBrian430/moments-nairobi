"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import { cn } from "@/lib/utils";

export interface GalleryProps {
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onSelectImageIndex: (index: number) => void;
}

export function Gallery({
  images,
  productName,
  selectedImageIndex,
  onSelectImageIndex,
}: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  // Sync mobile scroll position when selectedImageIndex changes externally (e.g. from variant select)
  useEffect(() => {
    if (mobileCarouselRef.current) {
      const container = mobileCarouselRef.current;
      const targetLeft = selectedImageIndex * container.clientWidth;
      if (Math.abs(container.scrollLeft - targetLeft) > 10) {
        container.scrollTo({ left: targetLeft, behavior: "smooth" });
      }
    }
  }, [selectedImageIndex]);

  // Handle mobile swipe snap scroll updates
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const slideWidth = container.clientWidth;
    if (slideWidth > 0) {
      const newIndex = Math.round(container.scrollLeft / slideWidth);
      if (newIndex >= 0 && newIndex < images.length && newIndex !== selectedImageIndex) {
        onSelectImageIndex(newIndex);
      }
    }
  };

  // Keyboard navigation on desktop when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      onSelectImageIndex(
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      );
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      onSelectImageIndex(
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setLightboxOpen(true);
    }
  };

  const currentImage = images[selectedImageIndex] || images[0];
  const nextImageIndex = (selectedImageIndex + 1) % images.length;
  const nextImage = images[nextImageIndex];

  return (
    <div className="w-full">
      {/* DESKTOP GALLERY (>= 1024px) */}
      <div
        className="hidden lg:flex gap-4 items-start outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Product image gallery. Use arrow keys to cycle images, Enter to expand."
      >
        {/* Left vertical thumbnail strip (64px wide, 4:5 aspect ratio) */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2.5 w-16 shrink-0" role="tablist" aria-label="Product thumbnails">
            {images.map((img, idx) => {
              const isSelected = idx === selectedImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Thumbnail ${idx + 1} of ${images.length}`}
                  onClick={() => onSelectImageIndex(idx)}
                  className={cn(
                    "relative w-16 aspect-[4/5] rounded-[2px] overflow-hidden bg-[#EDEAE4] transition-all cursor-pointer border",
                    isSelected
                      ? "border-[#111111] ring-1 ring-[#111111]"
                      : "border-[#E4E0D8] opacity-75 hover:opacity-100 hover:border-[#6B6B66]"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Right large image (4:5 aspect ratio, background #EDEAE4, radius 2px) */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative flex-1 aspect-[4/5] rounded-[2px] bg-[#EDEAE4] overflow-hidden cursor-zoom-in group"
        >
          <Image
            src={currentImage}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* MOBILE GALLERY (< 1024px): horizontal swipe carousel with scroll-snap */}
      <div className="lg:hidden relative w-full -mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full">
        <div
          ref={mobileCarouselRef}
          onScroll={handleMobileScroll}
          className="relative w-full aspect-[4/5] flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-none bg-[#EDEAE4]"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxOpen(true)}
              className="relative w-full h-full shrink-0 snap-center aspect-[4/5] cursor-zoom-in"
            >
              <Image
                src={img}
                alt={`${productName} ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover rounded-none"
              />
            </div>
          ))}
        </div>

        {/* Mobile image counter "1 / 5" */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-[#111111]/75 text-white text-[11px] font-mono px-2 py-0.5 rounded-[2px] tracking-wide pointer-events-none">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 py-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectImageIndex(idx);
                  if (mobileCarouselRef.current) {
                    mobileCarouselRef.current.scrollTo({
                      left: idx * mobileCarouselRef.current.clientWidth,
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "h-1.5 transition-all rounded-[2px]",
                  idx === selectedImageIndex
                    ? "w-6 bg-[#111111]"
                    : "w-1.5 bg-[#E4E0D8] hover:bg-[#6B6B66]"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preload next image silently */}
      {images.length > 1 && nextImage && (
        <div className="hidden" aria-hidden="true">
          <Image
            src={nextImage}
            alt=""
            width={1}
            height={1}
            priority={false}
          />
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setLightboxOpen(false)}
          onChangeIndex={(idx) => onSelectImageIndex(idx)}
          productName={productName}
        />
      )}
    </div>
  );
}
