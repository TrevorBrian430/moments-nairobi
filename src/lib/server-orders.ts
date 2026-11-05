import { PRODUCTS } from "@/lib/constants";
import { POLICIES } from "@/config/policies";

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

export interface ServerOrder {
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

declare global {
  // eslint-disable-next-line no-var
  var __moments_server_orders: Map<string, ServerOrder> | undefined;
  // eslint-disable-next-line no-var
  var __moments_idempotency_keys: Map<string, string> | undefined;
}

const ordersMap =
  globalThis.__moments_server_orders ||
  (globalThis.__moments_server_orders = new Map<string, ServerOrder>());

const idempotencyMap =
  globalThis.__moments_idempotency_keys ||
  (globalThis.__moments_idempotency_keys = new Map<string, string>());

export function getOrderByIdServer(idOrNumber: string): ServerOrder | undefined {
  if (ordersMap.has(idOrNumber)) {
    return ordersMap.get(idOrNumber);
  }
  for (const order of ordersMap.values()) {
    if (order.orderNumber === idOrNumber || order.id === idOrNumber) {
      return order;
    }
  }
  return undefined;
}

export interface CreateOrderParams {
  idempotencyKey?: string;
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

export function createOrderServer(params: CreateOrderParams): ServerOrder {
  // Check idempotency
  if (params.idempotencyKey && idempotencyMap.has(params.idempotencyKey)) {
    const existingOrderId = idempotencyMap.get(params.idempotencyKey)!;
    const existing = ordersMap.get(existingOrderId);
    if (existing) return existing;
  }

  // 1. Recompute prices server-side from product data (never trust client prices)
  let subtotal = 0;
  const verifiedItems: ServerOrderItem[] = [];

  for (const clientItem of params.items) {
    const product = PRODUCTS.find((p) => p.id === clientItem.productId);
    if (!product) continue;

    const unitPrice = product.salePrice ?? product.price;
    const qty = Math.max(1, Math.min(clientItem.quantity || 1, product.stockCount || 10));
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

  // 2. Recompute delivery fee
  let deliveryFee = 0;
  if (params.deliveryMethod === "courier") {
    const townObj = POLICIES.delivery.towns.find(
      (t) => t.name === params.deliveryTown
    );
    deliveryFee = townObj ? townObj.fee : 500;
  } else {
    deliveryFee = 0; // Pickup is free
  }

  const total = subtotal + deliveryFee;

  // 3. Generate IDs
  const id = `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `MN-${randomNum}`;
  const createdAt = new Date().toISOString();

  const newOrder: ServerOrder = {
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

  ordersMap.set(id, newOrder);

  if (params.idempotencyKey) {
    idempotencyMap.set(params.idempotencyKey, id);
  }

  return newOrder;
}

export function updateOrderPaymentStatus(
  referenceOrId: string,
  paymentStatus: "pending" | "paid" | "failed"
): ServerOrder | undefined {
  for (const order of ordersMap.values()) {
    if (
      order.id === referenceOrId ||
      order.orderNumber === referenceOrId ||
      order.paymentReference === referenceOrId
    ) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") {
        order.paidAt = new Date().toISOString();
      }
      return order;
    }
  }
  return undefined;
}
