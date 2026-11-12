"use client";

import { useState } from "react";
import { Download, MessageCircle, Plus, Search } from "lucide-react";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import type { Category, Product } from "@/lib/constants";
import type { DeliveryTown } from "@/config/policies";
import ManualOrderForm from "./ManualOrderForm";
import type { CreateOrderParams, OrderStatus, ServerOrder } from "@/lib/server-orders";

const statuses: OrderStatus[] = ["Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"];
const orderSources = { website: "Website", whatsapp: "WhatsApp", "in-store": "In store" } as const;
const paymentStatuses = ["pending", "paid", "failed"] as const;
const date = new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" });

function exportOrders(orders: ServerOrder[]) {
  const columns = ["Order", "Source", "Placed (Nairobi)", "Customer", "Phone", "Email", "Delivery", "Fulfilment", "Payment", "Subtotal (KES)", "Delivery (KES)", "Total (KES)"];
  const rows = orders.map((order) => [
    order.orderNumber, orderSources[order.source ?? "website"], date.format(new Date(order.createdAt)), order.customerName, order.customerPhone,
    order.customerEmail ?? "", order.deliveryTown ?? "Pickup", order.status, order.paymentStatus,
    order.subtotal, order.deliveryFee, order.total,
  ]);
  const csv = [columns, ...rows].map((row) => row.map((value) => {
    const safe = typeof value === "string" && /^[\s=+@-]/.test(value) ? "'" + value : String(value);
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "moments-nairobi-orders.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function OrdersPanel({ orders, products, categories, towns, busy, update, create }: {
  orders: ServerOrder[];
  products: Product[];
  categories: Category[];
  towns: DeliveryTown[];
  create: (source: "whatsapp" | "in-store", order: Omit<CreateOrderParams, "paymentMethod">) => Promise<boolean>;
  busy: boolean;
  update: (id: string, changes: { status?: OrderStatus; paymentStatus?: ServerOrder["paymentStatus"] }) => Promise<boolean>;
}) {
  const [creating, setCreating] = useState(false);
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [selected, setSelected] = useState<string>();
  const visible = orders.filter((order) =>
    (!source || source === (order.source ?? "website")) && (!status || status === order.status) && (!payment || payment === order.paymentStatus) &&
    [order.orderNumber, order.customerName, order.customerPhone, order.customerEmail].some(
      (value) => value?.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
  const detail = orders.find((order) => order.id === selected);
  const field = "rounded-[9px] border border-[#d9c2b0] bg-[#fffaf5] px-3 py-2 text-sm";

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-extrabold">Orders</h1>
        <div className="flex flex-wrap gap-2">
        <button disabled={busy} onClick={() => setCreating(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-[#733d29] px-4 text-sm font-semibold text-white">
          <Plus size={16} /> New order
        </button>
        <button disabled={!visible.length} onClick={() => exportOrders(visible)}
          className="inline-flex items-center gap-2 rounded-[9px] border border-[#d9c2b0] bg-[#fffaf5] px-4 py-2 text-sm font-bold disabled:opacity-50">
          <Download size={16} /> Export filtered orders
        </button>
        </div>
      </div>
      {creating && <ManualOrderForm products={products} categories={categories} towns={towns} busy={busy} save={create} close={() => setCreating(false)} />}
      <div className="flex flex-wrap gap-3">
        <label className={`flex min-w-0 basis-full items-center gap-2 sm:basis-64 ${field}`}>
          <Search size={16} aria-hidden="true" />
          <input aria-label="Search orders" placeholder="Search order, customer or phone" value={query}
            onChange={(event) => setQuery(event.target.value)} className="w-0 min-w-0 grow outline-none" />
        </label>
        <select aria-label="Filter by fulfilment" value={status} onChange={(event) => setStatus(event.target.value)} className={field}>
          <option value="">All fulfilment statuses</option>
          {statuses.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="Filter by source" value={source} onChange={(event) => setSource(event.target.value)} className={field}>
          <option value="">All order sources</option>
          {Object.entries(orderSources).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Filter by payment" value={payment} onChange={(event) => setPayment(event.target.value)} className={field}>
          <option value="">All payment statuses</option>
          {paymentStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>

      <div className="admin-table-frame overflow-x-auto rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5]">
        <table className="admin-table w-full text-left text-sm" role="table">
          <thead role="rowgroup" className="bg-[#efe1d6] text-[#705648]">
            <tr role="row">{["Order", "Customer", "Delivery", "Total", "Fulfilment", "Payment"].map((heading) =>
              <th role="columnheader" key={heading} scope="col" className="px-4 py-3">{heading}</th>)}</tr>
          </thead>
          <tbody role="rowgroup" className="divide-y divide-[#eadbd0]">
            {visible.map((order) => (
              <tr role="row" key={order.id} className={selected === order.id ? "bg-[#f0e0d2]" : "hover:bg-[#f4ebe1]"}>
                <td role="cell" className="px-4 py-3">
                  <button onClick={() => setSelected(order.id)} className="inline-flex min-h-10 items-center font-bold text-[#733d29] underline underline-offset-4">{order.orderNumber}</button>
                  <div className="mt-1 text-xs text-[#705648]">{date.format(new Date(order.createdAt))} · {orderSources[order.source ?? "website"]}</div>
                </td>
                <td role="cell" data-label="Customer" className="px-4 py-3">{order.customerName}</td>
                <td role="cell" data-label="Delivery" className="px-4 py-3">{order.deliveryTown ?? "Store pickup"}</td>
                <td role="cell" data-label="Total" className="px-4 py-3 whitespace-nowrap">{formatPrice(order.total)}</td>
                <td role="cell" data-label="Fulfilment" className="px-4 py-3">{order.status}</td>
                <td role="cell" data-label="Payment" className="px-4 py-3 capitalize">{order.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <p className="p-6 text-sm text-[#705648]">{orders.length ? "No orders match these filters." : "Orders appear here after checkout or manual entry."}</p>}
      </div>

      {detail && (
        <section aria-label="Order details" className="space-y-5 rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{detail.orderNumber}</h2>
            <button onClick={() => setSelected(undefined)} className="text-sm font-semibold underline">Close details</button>
          </div>
          <div className="grid gap-5 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <h3 className="font-bold">Customer</h3>
              <p>{detail.customerName}</p>
              <a className="block underline" href={`tel:${detail.customerPhone}`}>{detail.customerPhone}</a>
              {detail.customerEmail && <a className="block break-all underline" href={`mailto:${detail.customerEmail}`}>{detail.customerEmail}</a>}
              <a href={generateWhatsAppLink(detail.customerPhone, `Hi ${detail.customerName}, this is Moments Nairobi about order ${detail.orderNumber}.`)}
                target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-green-700"><MessageCircle size={15} /> WhatsApp</a>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">Delivery</h3>
              <p>{detail.deliveryTown ?? "Store pickup"}</p>
              {detail.deliveryAddress && <p>{detail.deliveryAddress}</p>}
              {detail.deliveryLandmark && <p>{detail.deliveryLandmark}</p>}
              {detail.notes && <p className="text-[#705648]">{detail.notes}</p>}
            </div>
          </div>
          <ul className="divide-y divide-[#eadbd0] border-y border-[#e4d6ca] text-sm">
            {detail.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-4 py-2">
                <span>{item.quantity} × {item.name}{[item.color, item.size].filter(Boolean).length > 0 && ` (${[item.color, item.size].filter(Boolean).join(", ")})`}</span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm">Delivery {formatPrice(detail.deliveryFee)} · <strong>Total {formatPrice(detail.total)}</strong></p>
          <div className="flex flex-wrap gap-4">
            <label className="grid gap-1 text-sm font-semibold">
              Fulfilment
              <select className={field} value={detail.status} disabled={busy || detail.status === "Cancelled"}
                onChange={(event) => {
                  const next = event.target.value as OrderStatus;
                  if (next !== "Cancelled" || confirm("Cancel this order and return its items to inventory?")) void update(detail.id, { status: next });
                }}>
                {statuses.map((value) => <option key={value} disabled={value === "Cancelled" && (detail.status === "Delivered" || detail.paymentStatus === "paid")}>{value}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Payment · {detail.paymentMethod === "pickup" ? "on pickup" : "on delivery"}
              <select className={field} value={detail.paymentStatus} disabled={busy || detail.status === "Cancelled"}
                onChange={(event) => void update(detail.id, { paymentStatus: event.target.value as ServerOrder["paymentStatus"] })}>
                {paymentStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
          {detail.paidAt && <p className="text-xs text-[#705648]">Payment recorded {date.format(new Date(detail.paidAt))}</p>}
        </section>
      )}
    </section>
  );
}
