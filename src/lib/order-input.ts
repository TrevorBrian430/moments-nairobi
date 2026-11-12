import { OrderInputError, type CreateOrderParams } from "@/lib/server-orders";

export function parseOrderInput(input: unknown): CreateOrderParams {
  if (!input || typeof input !== "object") throw new OrderInputError("Invalid order details.");
  const body = input as Record<string, unknown>;
  const { customerName, customerPhone, deliveryMethod, expectedTotal, items } = body;
  if (typeof customerName !== "string" || !customerName.trim() || customerName.length > 200) {
    throw new OrderInputError("Enter the customer's name.");
  }
  if (typeof customerPhone !== "string" || !customerPhone.trim() || customerPhone.length > 40) {
    throw new OrderInputError("Enter a valid phone number.");
  }
  if (deliveryMethod !== "pickup" && deliveryMethod !== "courier") {
    throw new OrderInputError("Choose a valid delivery method.");
  }
  function optionalText(value: unknown, limit = 1000) {
    if (value === undefined) return undefined;
    if (typeof value !== "string" || value.length > limit) throw new OrderInputError("Invalid order details.");
    return value.trim() || undefined;
  }
  const deliveryTown = optionalText(body.deliveryTown);
  const deliveryAddress = optionalText(body.deliveryAddress);
  if (deliveryMethod === "courier" && (!deliveryTown || !deliveryAddress)) {
    throw new OrderInputError("Town and address are required for courier delivery.");
  }
  const paymentMethod = deliveryMethod === "pickup" ? "pickup" : "delivery";
  if (body.paymentMethod !== undefined && body.paymentMethod !== paymentMethod) {
    throw new OrderInputError("Select a payment method available for this delivery option.");
  }
  if (!Array.isArray(items) || !items.length || items.length > 100) {
    throw new OrderInputError("Add between 1 and 100 order lines.");
  }
  if (expectedTotal !== undefined && (typeof expectedTotal !== "number" || !Number.isSafeInteger(expectedTotal))) {
    throw new OrderInputError("Invalid order total.");
  }

  return {
    customerName, customerPhone, deliveryMethod, paymentMethod, expectedTotal,
    deliveryTown, deliveryAddress,
    idempotencyKey: optionalText(body.idempotencyKey),
    customerEmail: optionalText(body.customerEmail),
    deliveryLandmark: optionalText(body.deliveryLandmark),
    notes: optionalText(body.notes),
    items: items.map((item) => {
      if (!item || typeof item.productId !== "string" || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
        throw new OrderInputError("Choose a product and a whole quantity for each line.");
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        color: optionalText(item.color, 200),
        size: optionalText(item.size, 200),
        variantId: optionalText(item.variantId, 200),
        variantLabel: optionalText(item.variantLabel, 200),
      };
    }),
  };
}
