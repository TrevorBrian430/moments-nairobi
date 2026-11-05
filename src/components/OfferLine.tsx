import React from "react";
import { ArrowRight } from "lucide-react";
import { offers } from "@/config/offers";
import { generateWhatsAppLink } from "@/lib/utils";

export default function OfferLine() {
  if (!offers.firstOrder.enabled) {
    return null;
  }

  const { text, actionText, phone, message } = offers.firstOrder;
  const whatsappUrl = generateWhatsAppLink(phone, message);

  return (
    <aside
      aria-label="Promotional offer"
      className="w-full h-12 bg-[var(--color-background)] border-y border-[var(--color-hairline)] flex items-center justify-center px-4"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <span className="text-[var(--color-ink)] font-normal truncate">
          {text}
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 font-medium text-[var(--color-accent)] hover:underline underline-offset-4 shrink-0 py-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] min-h-[44px]"
        >
          <span>{actionText}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </aside>
  );
}
