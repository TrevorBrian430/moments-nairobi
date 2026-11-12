import { isAdmin } from "@/lib/admin-auth";
import { type Category, type Product } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { deliveryTowns } from "@/lib/delivery-fees";
import { parseOrderInput } from "@/lib/order-input";
import { createOrderServer, OrderInputError, ORDER_STATUSES } from "@/lib/server-orders";
import { readStore, updateStore } from "@/lib/store-db";

class AdminInputError extends Error {}

const text = (value: unknown, max: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;

const money = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 10_000_000;

function validImage(value: unknown) {
  if (!text(value, 500)) return false;
  return /^\/images\/[^\\?#]+$/i.test(value) || /^https:\/\/[^\s]+$/.test(value);
}

function validateProduct(product: Product, categories: Category[]) {
  if (!product || !text(product.id, 80) || !text(product.name, 160) ||
    !text(product.slug, 120) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug) ||
    !text(product.description, 5000) || !categories.some((category) => category.slug === product.category) ||
    !money(product.price) || product.price === 0 || !money(product.stockCount) ||
    (product.salePrice !== undefined && (!money(product.salePrice) || product.salePrice >= product.price)) ||
    ![product.inStock, product.isFeatured, product.isNew].every((value) => typeof value === "boolean") ||
    !Array.isArray(product.images) || !product.images.length || product.images.length > 24 || !product.images.every(validImage) ||
    !Array.isArray(product.features) || product.features.length > 40 || !product.features.every((value) => text(value, 300)) ||
    (product.sizes !== undefined && (!Array.isArray(product.sizes) || product.sizes.length > 40 || !product.sizes.every((value) => text(value, 80)))) ||
    (product.colors !== undefined && (!Array.isArray(product.colors) || product.colors.length > 40 ||
      !product.colors.every((color) => color && text(color.name, 80) && /^#[a-f0-9]{6}$/i.test(color.hex) &&
        (!color.image || validImage(color.image)))))) {
    throw new AdminInputError("Check the product fields, pricing, stock and image URLs.");
  }

  const { id, name, slug, category, price, salePrice, description, features, images,
    sizes, colors, inStock, stockCount, isFeatured, isNew } = product;
  return {
    id, name: name.trim(), slug, category, price, salePrice, description: description.trim(),
    features, images, sizes, colors: colors?.map(({ name, hex, image }) => ({ name, hex, image })),
    inStock, stockCount, isFeatured, isNew,
  };
}

export async function GET() {
  if (!await isAdmin()) return Response.json({ error: "Sign in to continue." }, { status: 401 });
  const { categories, products, orders, deliveryFees } = await readStore();
  return Response.json({ categories, products, orders, towns: deliveryTowns(deliveryFees) }, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Sign in to continue." }, { status: 401 });
  const body = await request.json().catch(() => null);
  try {
    if (body?.action === "createOrder") {
      if (body.source !== "whatsapp" && body.source !== "in-store") {
        throw new AdminInputError("Choose where the order was placed.");
      }
      const order = await createOrderServer(parseOrderInput(body.order), body.source);
      const { orders, products } = await readStore();
      return Response.json({ orders, products, orderId: order.id });
    }
    const result = await updateStore((data) => {
      switch (body?.action) {
        case "saveCategory": {
          const { id, name, description, image } = body.category ?? {};
          if (!text(name, 80) || typeof description !== "string" || description.length > 500 || !validImage(image)) {
            throw new AdminInputError("Enter a category name and a valid image path or HTTPS URL.");
          }
          const index = id === undefined ? -1 : data.categories.findIndex((category) => category.id === id);
          if (id !== undefined && index === -1) throw new AdminInputError("Category no longer exists.");
          const slug = index === -1 ? slugify(name) : data.categories[index].slug;
          if (!slug || slug === "all" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            throw new AdminInputError("Choose a category name that gives it a valid URL.");
          }
          if (data.categories.some((category, current) => current !== index &&
            (category.slug === slug || category.name.toLowerCase() === name.trim().toLowerCase()))) {
            throw new AdminInputError("A category with this name or URL already exists.");
          }
          const category: Category = { id: id ?? slug, slug, name: name.trim(), description: description.trim(), image };
          if (index === -1) data.categories.push(category);
          else data.categories[index] = category;
          return { categories: data.categories };
        }
        case "deleteCategory": {
          const category = data.categories.find((entry) => entry.id === body.id);
          if (!category) throw new AdminInputError("Category no longer exists.");
          if (data.products.some((product) => product.category === category.slug)) {
            throw new AdminInputError("Move the products in this category before deleting it.");
          }
          data.categories = data.categories.filter((entry) => entry.id !== category.id);
          return { categories: data.categories };
        }
        case "saveProduct": {
          const product = validateProduct(body.product, data.categories);
          const index = data.products.findIndex((entry) => entry.id === product.id);
          if (body.editing ? index === -1 || (data.products[index].stockCount ?? 10) !== body.expectedStock : index !== -1) {
            throw new AdminInputError("Stock changed while you were editing. Refresh and reopen the product.");
          }
          if (data.products.some((entry) => entry.slug === product.slug && entry.id !== product.id)) {
            throw new AdminInputError("This product URL is already in use.");
          }
          if (index === -1) data.products.unshift({ ...product, createdAt: new Date().toISOString() });
          else data.products[index] = { ...product, createdAt: data.products[index].createdAt };
          return { products: data.products };
        }
        case "deleteProduct": {
          if (data.orders.some((order) => order.status !== "Cancelled" && order.status !== "Delivered" &&
            order.items.some((item) => item.productId === body.id))) {
            throw new AdminInputError("This product belongs to an open order. Complete or cancel that order first.");
          }
          data.products = data.products.filter((product) => product.id !== body.id);
          return { products: data.products };
        }
        case "updateOrder": {
          const order = data.orders.find((entry) => entry.id === body.id);
          if (!order) throw new AdminInputError("Order not found.");
          if (body.status !== undefined) {
            if (!ORDER_STATUSES.includes(body.status)) throw new AdminInputError("Choose a valid order status.");
            if (order.status === "Delivered" && body.status === "Cancelled") {
              throw new AdminInputError("A delivered order cannot be cancelled.");
            }
            if (order.status === "Cancelled" && body.status !== "Cancelled") {
              throw new AdminInputError("Cancelled orders cannot be reopened.");
            }
            if (body.status === "Cancelled" && order.stockReserved) {
              if (order.paymentStatus === "paid") throw new AdminInputError("Resolve the payment before cancelling.");
              for (const item of order.items) {
                const product = data.products.find((entry) => entry.id === item.productId);
                if (product) product.stockCount = (product.stockCount ?? 10) + item.quantity;
              }
              order.stockReserved = false;
            }
            order.status = body.status;
          }
          if (body.paymentStatus !== undefined) {
            if (!["pending", "paid", "failed"].includes(body.paymentStatus)) {
              throw new AdminInputError("Choose a valid payment status.");
            }
            if (order.status === "Cancelled") throw new AdminInputError("This order has been cancelled.");
            if (order.paymentStatus !== body.paymentStatus) {
              order.paymentStatus = body.paymentStatus;
              order.paidAt = body.paymentStatus === "paid" ? new Date().toISOString() : undefined;
            }
          }
          return { orders: data.orders, products: data.products };
        }
        case "deliveryFees": {
          const towns = deliveryTowns();
          if (!body.fees || !towns.every(({ name }) => money(body.fees[name]))) {
            throw new AdminInputError("Enter a whole KES amount for every delivery town.");
          }
          data.deliveryFees = Object.fromEntries(towns.map(({ name }) => [name, body.fees[name]]));
          return { towns: deliveryTowns(data.deliveryFees) };
        }
        default:
          throw new AdminInputError("Unknown admin action.");
      }
    });
    return Response.json(result);
  } catch (error) {
    if (error instanceof AdminInputError || error instanceof OrderInputError) return Response.json({ error: error.message }, { status: 400 });
    console.error("Admin update failed:", error);
    return Response.json({ error: "Could not save changes. Try again." }, { status: 500 });
  }
}
