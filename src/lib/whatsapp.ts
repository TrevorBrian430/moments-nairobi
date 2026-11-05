import { STORE_INFO } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/utils";

export interface WhatsAppOrderLine {
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface BuildWhatsAppOrderParams {
  items: WhatsAppOrderLine[];
  subtotal: number;
  deliveryFee?: number;
  deliveryPreference?: string;
  orderNumber?: string;
}

export function cleanBrandName(name: string): string {
  return name
    .replace(/Louis\s*Vuitton/gi, "Monogram")
    .replace(/Goyard/gi, "Chevron");
}

export function buildWhatsAppOrderMessage(
  params: BuildWhatsAppOrderParams
): string {
  const lines: string[] = [];

  if (params.orderNumber) {
    lines.push(`Order Reference: #${params.orderNumber}`);
  }

  lines.push("Hello Moments Nairobi, I would like to order:");

  params.items.forEach((item) => {
    const cleaned = cleanBrandName(item.name);
    const options = [item.color, item.size ? `Size ${item.size}` : null]
      .filter(Boolean)
      .join(", ");

    const formattedPrice = `KES ${(item.price * item.quantity).toLocaleString("en-KE")}`;
    lines.push(
      `• ${item.quantity}x ${cleaned}${options ? `, ${options}` : ""}, ${formattedPrice}`
    );
  });

  lines.push(`Subtotal: KES ${params.subtotal.toLocaleString("en-KE")}`);

  if (params.deliveryPreference) {
    lines.push(`Delivery preference: ${params.deliveryPreference}`);
  }

  if (typeof params.deliveryFee === "number") {
    const feeText =
      params.deliveryFee === 0
        ? "Free (Nairobi CBD)"
        : `KES ${params.deliveryFee.toLocaleString("en-KE")}`;
    lines.push(`Delivery fee: ${feeText}`);
    const grandTotal = params.subtotal + params.deliveryFee;
    lines.push(`Total: KES ${grandTotal.toLocaleString("en-KE")}`);
  }

  return lines.join("\n");
}

export function getWhatsAppOrderUrl(params: BuildWhatsAppOrderParams): string {
  const message = buildWhatsAppOrderMessage(params);
  return generateWhatsAppLink(STORE_INFO.whatsappPhone, message);
}
