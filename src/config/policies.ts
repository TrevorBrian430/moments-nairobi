import { STORE_INFO, STORE_HOURS } from "@/lib/constants";

export interface PolicyItem {
  title: string;
  summary: string;
  details: string;
}

export const POLICIES = {
  delivery: {
    title: "Delivery",
    summary: "Free in Nairobi CBD. Courier countrywide KES 300 to 500.",
    details:
      "Orders within Nairobi CBD qualify for free same-day delivery. Countrywide courier dispatch across Kenya is KES 300 to 500, delivered within 24 hours via reliable parcel couriers.",
  },
  pickup: {
    title: "Pickup",
    summary: `${STORE_INFO.address}. Ready within 1 hour.`,
    details: `Collect at ${STORE_INFO.address} (${STORE_INFO.addressDetail}). Store hours: ${STORE_HOURS.weekdays}; ${STORE_HOURS.saturday}; ${STORE_HOURS.sunday}.`,
    address: STORE_INFO.address,
    addressDetail: STORE_INFO.addressDetail,
    hours: STORE_HOURS.displayList,
    orderSteps: [
      "Select your item, color, and quantity, then tap Order on WhatsApp or Add to cart.",
      "Confirm your order details and delivery location or pickup window with our team.",
      "Receive prompt order packaging within 1 hour and your dispatch confirmation.",
    ],
  },
  exchange: {
    title: "Exchange",
    summary: "48-hour exchange for size or color swap with tags attached and receipt.",
    details:
      "We accept size or color exchanges within 48 hours of purchase or receipt. Items must be in original, unwashed condition with tags attached and accompanied by your order confirmation.",
  },
} as const;
