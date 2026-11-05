"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/utils";

export default function FloatingWhatsApp() {
  const whatsappUrl = generateWhatsAppLink(
    STORE_INFO.whatsappPhone,
    "Hello Moments Nairobi, I would like to make an inquiry about your collection."
  );

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Moments Nairobi on WhatsApp"
        className="flex items-center justify-center h-12 w-12 sm:w-auto sm:px-4 sm:gap-2 rounded-full bg-[#1FA855] hover:bg-[#198e47] text-white shadow-none transition-all duration-200 ease-out select-none cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FA855] focus-visible:ring-offset-2 active:translate-y-[1px]"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="hidden sm:inline text-xs font-medium tracking-normal">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}
