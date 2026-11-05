"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { type Product } from "@/lib/constants";
import { POLICIES } from "@/config/policies";
import { cn } from "@/lib/utils";

export interface DetailsAccordionProps {
  product: Product;
  className?: string;
}

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function DetailsAccordion({ product, className }: DetailsAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Open first item on desktop on mount, all closed on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpenItems(["details"]);
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Build spec rows ONLY from real fields that exist
  const specRows: { label: string; value: string }[] = [];

  // Color options
  if (product.colors && product.colors.length > 0) {
    specRows.push({
      label: "Color options",
      value: product.colors.map((c) => c.name).join(", "),
    });
  }

  // Sizes
  if (product.sizes && product.sizes.length > 0) {
    specRows.push({
      label: "Available sizes",
      value: product.sizes.join(", "),
    });
  }

  // Laptop size (from features if present)
  const laptopFeature = product.features?.find((f) =>
    f.toLowerCase().includes("laptop")
  );
  if (laptopFeature) {
    specRows.push({
      label: "Laptop compatibility",
      value: laptopFeature,
    });
  }

  // Closure (from features if present)
  const closureFeature = product.features?.find(
    (f) =>
      f.toLowerCase().includes("zip") ||
      f.toLowerCase().includes("buckle") ||
      f.toLowerCase().includes("closure")
  );
  if (closureFeature) {
    specRows.push({
      label: "Closure",
      value: closureFeature,
    });
  }

  // Strap (from features if present)
  const strapFeature = product.features?.find((f) =>
    f.toLowerCase().includes("strap")
  );
  if (strapFeature) {
    specRows.push({
      label: "Strap",
      value: strapFeature,
    });
  }

  // Category
  if (product.category) {
    specRows.push({
      label: "Category",
      value: product.category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    });
  }

  // Construct items
  const items: AccordionItem[] = [
    {
      id: "details",
      title: "Details",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
          <p>{product.description}</p>

          {/* Real features list */}
          {product.features && product.features.length > 0 && (
            <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-[#111111]">
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          )}

          {/* 2-column spec list if rows exist */}
          {specRows.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2 border-t border-[#E4E0D8]">
              {specRows.map((spec, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-[#111111]">{spec.label}: </span>
                  <span className="text-[#6B6B66]">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "materials-fit",
      title: "Materials and fit",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
          {product.sizes && product.sizes.length > 0 ? (
            <p>
              Available sizes:{" "}
              <span className="font-medium text-[#111111]">
                {product.sizes.join(", ")}
              </span>
              . Standard fit.
            </p>
          ) : laptopFeature ? (
            <p>
              Designed for daily commute and campus carry. Fits standard laptops
              up to 15 inches.
            </p>
          ) : (
            <p>
              Constructed for durability and daily carry. Inspect in store at
              our Nairobi CBD shop.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "delivery-pickup",
      title: "Delivery and pickup",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
          <div>
            <p className="font-medium text-[#111111] mb-1">Store Pickup</p>
            <p>
              {POLICIES.pickup.address} ({POLICIES.pickup.addressDetail}).
            </p>
            <div className="mt-1 space-y-0.5">
              {POLICIES.pickup.hours.map((h, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-[#111111]">{h.days}:</span>{" "}
                  {h.hours}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E4E0D8]">
            <p className="font-medium text-[#111111] mb-1">Courier Delivery</p>
            <p>{POLICIES.delivery.details}</p>
          </div>

          <div className="pt-2 border-t border-[#E4E0D8]">
            <p className="font-medium text-[#111111] mb-1">
              How WhatsApp Orders Work
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              {POLICIES.pickup.orderSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "exchange",
      title: "Exchange",
      content: (
        <div className="text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
          <p>{POLICIES.exchange.details}</p>
        </div>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "w-full max-w-[760px] divide-y divide-[#E4E0D8] border-y border-[#E4E0D8]",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className="py-1">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-btn-${item.id}`}
              className="w-full py-4 flex items-center justify-between text-left text-sm font-medium text-[#111111] hover:text-[#BB4C6C] transition-colors cursor-pointer"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#6B6B66] transition-transform duration-200 ease-out",
                  isOpen && "rotate-180 text-[#111111]"
                )}
              />
            </button>

            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-btn-${item.id}`}
                className="pb-5 pt-1 animate-fade-in transition-all duration-200 ease-out"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
