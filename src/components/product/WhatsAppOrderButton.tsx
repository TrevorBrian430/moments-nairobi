"use client";

import React, { useEffect, useState } from "react";
import { STORE_INFO, type Product } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface WhatsAppOrderButtonProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
  isOutOfStock?: boolean;
  className?: string;
}

export function WhatsAppOrderButton({
  product,
  selectedColor,
  selectedSize,
  quantity = 1,
  isOutOfStock = false,
  className,
}: WhatsAppOrderButtonProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Filter out any third-party brand names just in case
  const cleanName = product.name
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");

  const displayPrice = product.salePrice ?? product.price;
  const totalPrice = displayPrice * quantity;

  const inStockMessage = `Hi Moments Nairobi, I want to order:
• Item: ${cleanName}${selectedColor ? `\n• Color: ${selectedColor}` : ""}${
    selectedSize ? `\n• Size: ${selectedSize}` : ""
  }
• Quantity: ${quantity}
• Total: KES ${totalPrice.toLocaleString("en-KE")}${
    currentUrl ? `\n• Link: ${currentUrl}` : ""
  }`;

  const restockMessage = `Hi Moments Nairobi, is this item available for restock?
• Item: ${cleanName}${selectedColor ? `\n• Color: ${selectedColor}` : ""}${
    currentUrl ? `\n• Link: ${currentUrl}` : ""
  }`;

  const message = isOutOfStock ? restockMessage : inStockMessage;
  const whatsappUrl = generateWhatsAppLink(STORE_INFO.whatsappPhone, message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full h-[48px] rounded-[2px] border border-[#1FA855] text-[#1FA855] hover:bg-[#1FA855]/5 transition-colors flex items-center justify-center text-sm font-medium select-none cursor-pointer",
        className
      )}
    >
      {isOutOfStock ? "Ask about restock" : "Order on WhatsApp"}
    </a>
  );
}
