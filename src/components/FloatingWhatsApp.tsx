"use client";

import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/utils";

export default function FloatingWhatsApp() {
  const whatsappUrl = generateWhatsAppLink(
    STORE_INFO.whatsappPhone,
    "Hi Moments Nairobi! 👋 I have a question about your collection."
  );

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center group"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Moments Nairobi on WhatsApp"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-green-500/30 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/80"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
}
