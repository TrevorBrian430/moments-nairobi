"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  productName: string;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onChangeIndex,
  productName,
}: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape, navigate with Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setIsZoomed(false);
        onChangeIndex(
          currentIndex === 0 ? images.length - 1 : currentIndex - 1
        );
      } else if (e.key === "ArrowRight") {
        setIsZoomed(false);
        onChangeIndex(
          currentIndex === images.length - 1 ? 0 : currentIndex + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [currentIndex, images.length, onChangeIndex, onClose]);

  // Focus trap inside the modal
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded view of ${productName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/95 text-white backdrop-blur-sm outline-none"
    >
      {/* Top toolbar */}
      <div className="absolute top-0 inset-x-0 h-16 px-4 sm:px-6 flex items-center justify-between z-20 bg-gradient-to-b from-[#111111]/80 to-transparent">
        <span className="text-xs tracking-wider text-[#E4E0D8] font-mono">
          {currentIndex + 1} / {images.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            className="flex items-center justify-center w-11 h-11 rounded-[2px] text-[#E4E0D8] hover:text-white transition-colors cursor-pointer"
          >
            {isZoomed ? (
              <ZoomOut className="w-5 h-5" />
            ) : (
              <ZoomIn className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="flex items-center justify-center w-11 h-11 rounded-[2px] text-[#E4E0D8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-auto"
        onClick={() => setIsZoomed((prev) => !prev)}
      >
        <div
          className={`relative transition-transform duration-200 ease-out select-none ${
            isZoomed
              ? "scale-150 sm:scale-175 cursor-zoom-out"
              : "scale-100 cursor-zoom-in"
          } w-full max-w-4xl max-h-[85vh] aspect-[4/5]`}
        >
          <Image
            src={currentImage}
            unoptimized={(currentImage).startsWith("https://")}
            alt={`${productName} view ${currentIndex + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Left / Right Nav Buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
              onChangeIndex(
                currentIndex === 0 ? images.length - 1 : currentIndex - 1
              );
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-[2px] bg-[#111111]/60 text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
              onChangeIndex(
                currentIndex === images.length - 1 ? 0 : currentIndex + 1
              );
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-[2px] bg-[#111111]/60 text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}
