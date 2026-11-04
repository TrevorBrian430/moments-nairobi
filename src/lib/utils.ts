import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `KES ${price.toLocaleString()}`;
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const international = cleaned.startsWith("0")
    ? `254${cleaned.slice(1)}`
    : cleaned;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
