import { STORE_INFO, STORE_HOURS } from "@/lib/constants";

export interface DeliveryTown {
  name: string;
  zone: "cbd" | "greater-nairobi" | "countrywide";
  fee: number;
}

export const POLICIES = {
  delivery: {
    title: "Delivery",
    summary: "Store pickup is free. Courier fees vary by destination.",
    cartSummary: "Store pickup is free. Courier fees vary by destination.",
    details:
      "Courier is available across Kenya. Choose your destination at checkout to see the delivery fee.",
    freeThreshold: null, // No misleading free countrywide threshold
    towns: [
      { name: "Nairobi - CBD", zone: "cbd", fee: 0 },
      { name: "Nairobi - Westlands / Parklands / Kilimani", zone: "greater-nairobi", fee: 300 },
      { name: "Nairobi - Karen / Lang'ata / Rongai", zone: "greater-nairobi", fee: 300 },
      { name: "Nairobi - Kasarani / Roysambu / Kahawa", zone: "greater-nairobi", fee: 300 },
      { name: "Nairobi - Eastlands / Embakasi", zone: "greater-nairobi", fee: 300 },
      { name: "Mombasa", zone: "countrywide", fee: 500 },
      { name: "Nakuru", zone: "countrywide", fee: 500 },
      { name: "Kisumu", zone: "countrywide", fee: 500 },
      { name: "Eldoret", zone: "countrywide", fee: 500 },
      { name: "Thika", zone: "greater-nairobi", fee: 300 },
      { name: "Machakos", zone: "countrywide", fee: 400 },
      { name: "Nyeri", zone: "countrywide", fee: 500 },
      { name: "Naivasha", zone: "countrywide", fee: 400 },
      { name: "Kisii", zone: "countrywide", fee: 500 },
      { name: "Meru", zone: "countrywide", fee: 500 },
      { name: "Other Towns in Kenya", zone: "countrywide", fee: 500 },
    ] as DeliveryTown[],
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
  payments: {
    payOnPickup: true,
    payOnDelivery: true,
    payOnline: false, // Activated only when a real online provider (e.g. Pesapal) is configured
    acceptedLabel: "", // Left empty until Pesapal is live so the site does not promise what it cannot take
  },
} as const;
