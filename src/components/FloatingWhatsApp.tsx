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
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Moments Nairobi on WhatsApp"
        className="flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-semibold text-sm">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
}
