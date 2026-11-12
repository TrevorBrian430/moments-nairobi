import { randomUUID } from "node:crypto";
import { readStore, updateStore } from "@/lib/store-db";
import { deliveryTowns } from "@/lib/delivery-fees";

export interface ServerOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image: string;
  variantId?: string;
  variantLabel?: string;
  variantImage?: string;
}

export const ORDER_STATUSES = ["Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class OrderInputError extends Error {}

export interface ServerOrder {
  status: OrderStatus;
  source?: "website" | "whatsapp" | "in-store";
  stockReserved?: boolean;
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: "pickup" | "courier";
  deliveryZone?: string;
  deliveryTown?: string;
  deliveryAddress?: string;
  deliveryLandmark?: string;
  notes?: string;
  items: ServerOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "pickup" | "delivery" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  paymentReference?: string;
  paidAt?: string;
  createdAt: string;
}

export async function getOrderByIdServer(id: string) {
  return (await readStore()).orders.find((order) => order.id === id);
}

export interface CreateOrderParams {
  idempotencyKey?: string;
  expectedTotal?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: "pickup" | "courier";
  deliveryTown?: string;
  deliveryAddress?: string;
  deliveryLandmark?: string;
  notes?: string;
  paymentMethod: "pickup" | "delivery" | "online";
  items: {
    productId: string;
    quantity: number;
    color?: string;
    size?: string;
    variantId?: string;
    variantLabel?: string;
  }[];
}

export async function createOrderServer(params: CreateOrderParams, source: NonNullable<ServerOrder["source"]> = "website"): Promise<ServerOrder> {
  return updateStore((data) => {
    const key = params.idempotencyKey && (source === "website" ? params.idempotencyKey : `${source}:${params.idempotencyKey}`);
    const keys = source === "website" ? data.idempotency : (data.manualIdempotency ??= {});
    if (key && Object.hasOwn(keys, key)) {
      const existing = data.orders.find((order) => order.id === keys[key]);
      if (existing && (existing.source ?? "website") === source) return existing;
    }

    let subtotal = 0;
    const verifiedItems: ServerOrderItem[] = [];

    for (const clientItem of params.items) {
      const product = data.products.find((p) => p.id === clientItem.productId);
      if (!product || !product.inStock) throw new OrderInputError("An item is no longer available.");
      const unitPrice = product.salePrice ?? product.price;
      const qty = clientItem.quantity;
      const stock = product.stockCount ?? 10;
      if (!Number.isSafeInteger(qty) || qty < 1 || qty > stock) {
        throw new OrderInputError(`Only ${stock} available for ${product.name}.`);
      }
      product.stockCount = stock - qty;
      subtotal += unitPrice * qty;

      // Resolve variant image
      const variantColor = product.colors?.find(
        (c) => c.name === clientItem.color || c.name === clientItem.variantLabel
      );
      const resolvedImage =
        variantColor?.image || product.images[0] || "/images/bagpack 1.jpg";

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: qty,
        color: clientItem.color || clientItem.variantLabel,
        size: clientItem.size,
        image: resolvedImage,
        variantId: clientItem.variantId,
        variantLabel: clientItem.variantLabel || clientItem.color,
        variantImage: resolvedImage,
      });
    }

    const town = deliveryTowns(data.deliveryFees).find((entry) => entry.name === params.deliveryTown);
    if (params.deliveryMethod === "courier" && !town) throw new OrderInputError("Choose a valid delivery town.");
    const deliveryFee = params.deliveryMethod === "courier" ? town!.fee : 0;
    const total = subtotal + deliveryFee;
    if (params.expectedTotal !== undefined && total !== params.expectedTotal) {
      throw new OrderInputError("Prices or delivery fees changed. Review your updated total and try again.");
    }
    const id = `ord_${randomUUID()}`;
    const orderNumber = `MN-${id.slice(4, 17).replace("-", "").toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const newOrder: ServerOrder = {
      status: "Pending",
      source,
      stockReserved: true,
      id,
      orderNumber,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      customerEmail: params.customerEmail?.trim() || undefined,
      deliveryMethod: params.deliveryMethod,
      deliveryTown: params.deliveryTown,
      deliveryAddress: params.deliveryAddress?.trim(),
      deliveryLandmark: params.deliveryLandmark?.trim(),
      notes: params.notes?.trim() || undefined,
      items: verifiedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: params.paymentMethod,
      paymentStatus: "pending",
      paymentReference: `REF-${orderNumber}`,
      createdAt,
    };

    data.orders.unshift(newOrder);
    if (key) Object.defineProperty(keys, key, { value: id, enumerable: true });
    return newOrder;
  });
}
