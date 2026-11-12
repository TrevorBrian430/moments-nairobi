"use client";

import { createAdminRequestId } from "./request-id";

import { useState } from "react";
import type { Category, Product } from "@/lib/constants";
import type { DeliveryTown } from "@/config/policies";
import type { CreateOrderParams } from "@/lib/server-orders";
import { formatPrice } from "@/lib/utils";

type ManualSource = "whatsapp" | "in-store";
type ManualOrder = Omit<CreateOrderParams, "paymentMethod">;
type Line = ManualOrder["items"][number] & { key: number };
const field = "mt-1 block min-h-11 w-full rounded-[9px] border border-[#d9c2b0] bg-[#fffaf5] px-3 py-2 text-sm";

export default function ManualOrderForm({ products, categories, towns, busy, save, close }: {
  products: Product[];
  categories: Category[];
  towns: DeliveryTown[];
  busy: boolean;
  save: (source: ManualSource, order: ManualOrder) => Promise<boolean>;
  close: () => void;
}) {
  const [delivery, setDelivery] = useState<ManualOrder["deliveryMethod"]>("pickup");
  const [town, setTown] = useState("");
  const [lines, setLines] = useState<Line[]>([{ key: 0, productId: "", quantity: 1 }]);
  const [nextKey, setNextKey] = useState(1);
  const [idempotencyKey] = useState(createAdminRequestId);
  const available = products.filter((product) => product.inStock && (product.stockCount ?? 10) > 0);
  const subtotal = lines.reduce((sum, { productId, quantity }) => {
    const product = products.find(({ id }) => id === productId);
    return sum + (product ? (product.salePrice ?? product.price) * quantity : 0);
  }, 0);
  const total = subtotal + (delivery === "courier" ? towns.find(({ name }) => name === town)?.fee ?? 0 : 0);

  function changeLine(key: number, changes: Partial<Line>) {
    setLines((current) => current.map((line) => line.key === key ? { ...line, ...changes } : line));
  }

  return (
    <form className="space-y-5 rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5] p-4 sm:p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = (name: string) => String(data.get(name) ?? "").trim();
        if (await save(value("source") as ManualSource, {
          idempotencyKey, expectedTotal: total, customerName: value("customer"), customerPhone: value("phone"),
          customerEmail: value("email") || undefined, notes: value("notes") || undefined, deliveryMethod: delivery,
          deliveryTown: delivery === "courier" ? town : undefined,
          deliveryAddress: delivery === "courier" ? value("address") : undefined,
          items: lines.map(({ productId, quantity, color, size }) => ({ productId, quantity, color, size })),
        })) close();
      }}>
      <h2 className="text-lg font-semibold">Record an order</h2>
      {!available.length && <p className="text-sm text-[#705648]">Add stock to a product before recording an order.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Order source
          <select name="source" className={field}><option value="whatsapp">WhatsApp</option><option value="in-store">In store</option></select>
        </label>
        <label className="text-sm">Customer name<input name="customer" required maxLength={200} className={field} /></label>
        <label className="text-sm">Phone<input type="tel" name="phone" required maxLength={40} className={field} /></label>
        <label className="text-sm">Email (optional)<input type="email" name="email" maxLength={200} className={field} /></label>
        <label className="text-sm">Delivery method
          <select className={field} value={delivery} onChange={(event) => setDelivery(event.target.value as typeof delivery)}>
            <option value="pickup">Store pickup</option><option value="courier">Courier</option>
          </select>
        </label>
        {delivery === "courier" && <>
          <label className="text-sm">Destination
            <select className={field} required value={town} onChange={(event) => setTown(event.target.value)}>
              <option value="">Choose destination</option>
              {towns.map(({ name }) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">Delivery address<input name="address" required maxLength={500} className={field} /></label>
        </>}
        <label className="text-sm sm:col-span-2">Order notes<textarea name="notes" rows={2} maxLength={1000} className={field} /></label>
      </div>
      <div className="space-y-3">
        {lines.map((line, index) => {
          const product = available.find(({ id }) => id === line.productId);
          return (
            <fieldset key={line.key} className="grid gap-3 rounded-[10px] border border-[#e4d6ca] p-3 sm:grid-cols-2">
              <legend className="px-1 text-sm font-semibold">Item {index + 1}</legend>
              <label className="min-w-0 text-sm">Product
                <select className={field} value={line.productId} required onChange={(event) => {
                  const product = available.find(({ id }) => id === event.target.value);
                  changeLine(line.key, { productId: event.target.value, quantity: 1, color: product?.colors?.[0]?.name, size: product?.sizes?.[0] });
                }}>
                  <option value="">Choose product</option>
                  {categories.map(({ slug, name }) => {
                    const options = available.filter((product) => product.category === slug);
                    return options.length > 0 && <optgroup key={slug} label={name}>{options.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}</optgroup>;
                  })}
                </select>
              </label>
              <label className="text-sm">Quantity
                <input type="number" required className={field} value={line.quantity || ""} min={1} max={product?.stockCount ?? 10}
                  onChange={(event) => changeLine(line.key, { quantity: Number(event.target.value) })} />
              </label>
              {!!product?.colors?.length && <label className="text-sm">Colour<select className={field} value={line.color} onChange={(event) => changeLine(line.key, { color: event.target.value })}>
                {product.colors.map(({ name }) => <option key={name}>{name}</option>)}</select></label>}
              {!!product?.sizes?.length && <label className="text-sm">Size<select className={field} value={line.size} onChange={(event) => changeLine(line.key, { size: event.target.value })}>
                {product.sizes.map((size) => <option key={size}>{size}</option>)}</select></label>}
              {lines.length > 1 && <button type="button" className="min-h-10 text-left text-sm text-red-700" onClick={() => setLines(lines.filter(({ key }) => key !== line.key))}>Remove item {index + 1}</button>}
            </fieldset>
          );
        })}
        <button type="button" disabled={lines.length >= 100} className="min-h-11 text-sm font-semibold text-[#733d29]" onClick={() => {
          setLines([...lines, { key: nextKey, productId: "", quantity: 1 }]);
          setNextKey(nextKey + 1);
        }}>Add another item</button>
      </div>
      <p className="text-sm">Order total <strong>{formatPrice(total)}</strong></p>
      <div className="flex flex-wrap gap-3">
        <button disabled={busy || !available.length} className="min-h-11 rounded-[9px] bg-[#733d29] px-4 text-sm font-semibold text-white disabled:opacity-50">Save order</button>
        <button type="button" disabled={busy} onClick={close} className="min-h-11 px-3 text-sm">Cancel</button>
      </div>
    </form>
  );
}
