"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Banknote, Boxes, Package, ShoppingBag, TriangleAlert } from "lucide-react";
import { type Category, type Product } from "@/lib/constants";
import type { ServerOrder } from "@/lib/server-orders";
import { formatPrice } from "@/lib/utils";

const dayKey = new Intl.DateTimeFormat("en-CA", { dateStyle: "short", timeZone: "Africa/Nairobi" });
const dayLabel = new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", timeZone: "Africa/Nairobi" });
const card = "min-w-0 rounded-[18px] border border-[#e4d6ca] bg-[#fffaf5] p-4 sm:p-6";
const open = (order: ServerOrder) => order.status !== "Delivered" && order.status !== "Cancelled";

export default function Overview({ categories, products, orders, showOrders, showLowStock, editProduct }: {
  categories: Category[];
  products: Product[];
  orders: ServerOrder[];
  showOrders: () => void;
  showLowStock: () => void;
  editProduct: (product: Product) => void;
}) {
  const [range, setRange] = useState<7 | 30>(7);
  const [metric, setMetric] = useState<"paid" | "orders">("paid");
  const [today] = useState(() => new Date());
  const lowStock = products.filter((product) => (product.stockCount ?? 10) <= 8)
    .sort((a, b) => (a.stockCount ?? 10) - (b.stockCount ?? 10));
  const paid = orders.filter((order) => order.paymentStatus === "paid");
  const stats = [
    { label: "Paid order total", value: formatPrice(paid.reduce((sum, order) => sum + order.total, 0)), icon: Banknote, detail: "All recorded payments" },
    { label: "Open orders", value: orders.filter(open).length, icon: ShoppingBag, detail: "Awaiting fulfilment" },
    { label: "Low or zero stock", value: lowStock.length, icon: TriangleAlert, detail: "8 units or fewer" },
    { label: "Inventory retail value", value: formatPrice(products.reduce((sum, product) => sum + product.price * (product.stockCount ?? 10), 0)), icon: Boxes, detail: "At regular retail prices" },
  ];

  const daily = new Map<string, number>();
  for (const order of metric === "paid" ? paid : orders) {
    const time = metric === "paid" ? order.paidAt : order.createdAt;
    if (!time) continue;
    const key = dayKey.format(new Date(time));
    daily.set(key, (daily.get(key) ?? 0) + (metric === "paid" ? order.total : 1));
  }
  const days = Array.from({ length: range }, (_, index) => {
    const date = new Date(today.getTime() - (range - index - 1) * 86_400_000);
    return { label: dayLabel.format(date), value: daily.get(dayKey.format(date)) ?? 0 };
  });
  const total = days.reduce((sum, day) => sum + day.value, 0);
  const max = Math.max(1, ...days.map((day) => day.value));
  const categoryCounts = categories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.slug).length,
  }));
  const rangeLabel = `${days[0].label} – ${days.at(-1)?.label}`;
  const display = (value: number) => metric === "paid" ? formatPrice(value) : String(value);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#322019] sm:text-4xl">Overview</h1>
          <p className="mt-1 text-sm text-[#705648]">Sales, orders and stock across Moments Nairobi.</p>
        </div>
        <button onClick={showOrders} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[#733d29] px-4 text-sm font-semibold text-white hover:bg-[#582c1c]">
          View orders <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">
        {stats.map(({ label, value, icon: Icon, detail }) => (
          <section key={label} className={card}>
            <span className="mb-3 inline-flex size-9 items-center justify-center rounded-[10px] bg-[#f0e0d2] text-[#733d29]"><Icon size={18} aria-hidden="true" /></span>
            <h2 className="text-sm font-medium text-[#705648]">{label}</h2>
            <p className="my-1 break-words text-lg font-semibold tracking-tight text-[#322019] sm:text-2xl">{value}</p>
            <p className="text-xs text-[#705648]">{detail}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className={card}>
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Store activity</h2>
              <p className="mt-1 text-xs text-[#705648]">{rangeLabel} · Nairobi time</p>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <select aria-label="Chart metric" value={metric} onChange={(event) => setMetric(event.target.value as typeof metric)} className="min-h-10 rounded-[8px] border border-[#dfcbb9] bg-[#fffaf5] px-2 text-sm">
                <option value="paid">Payments</option>
                <option value="orders">Orders</option>
              </select>
              <select aria-label="Chart date range" value={range} onChange={(event) => setRange(event.target.value === "7" ? 7 : 30)} className="min-h-10 rounded-[8px] border border-[#dfcbb9] bg-[#fffaf5] px-2 text-sm">
                <option value="7">7 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>
          <p className="mt-5 text-3xl font-semibold tracking-tight text-[#322019]">{display(total)}</p>
          <p className="mt-1 text-xs text-[#705648]">{metric === "paid" ? "Payments recorded in this period" : "Orders placed in this period"}</p>
          <div className="relative mt-4">
            {!total && <p className="pointer-events-none absolute inset-x-0 top-[40%] z-10 mx-auto w-fit rounded-[8px] bg-[#fffaf5] px-2 py-1 text-center text-xs text-[#705648]">No {metric === "paid" ? "payments" : "orders"} in this period</p>}
            <div className="grid h-36 items-end gap-1 border-b border-[#dfcbb9] sm:h-44 sm:gap-2" style={{ gridTemplateColumns: `repeat(${range}, minmax(0, 1fr))`, background: "repeating-linear-gradient(to top, transparent 0 calc(25% - 1px), #eadbd0 calc(25% - 1px) 25%)" }} role="img" aria-label={`Daily ${metric === "paid" ? "payments" : "orders"}, ${rangeLabel}: ${days.map(({ label, value }) => `${label} ${display(value)}`).join(", ")}`}>
              {days.map(({ label, value }) => <span key={label} aria-hidden="true" title={`${label} · ${display(value)}`} className="mx-auto w-full max-w-10 rounded-t-[5px] bg-[#a36343] hover:bg-[#733d29]" style={{ height: value ? `${Math.max(2, value / max * 100)}%` : "2px", opacity: value ? 1 : 0.3 }} />)}
            </div>
            <div className="mt-2 flex justify-between text-xs text-[#705648]" aria-hidden="true">
              <span>{days[0].label}</span><span>{days[Math.floor(days.length / 2)].label}</span><span>{days.at(-1)?.label}</span>
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className="text-lg font-semibold">Catalog by category</h2>
          <p className="mt-1 text-xs text-[#705648]">{products.length} products in the catalog</p>
          <ul className="mt-5 space-y-4">
            {categoryCounts.map(({ id, name, count }) => (
              <li key={id}>
                <div className="mb-1.5 flex justify-between gap-3 text-sm"><span>{name}</span><span className="font-semibold tabular-nums">{count}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f0e0d2]" aria-hidden="true">
                  <div className="h-full rounded-full bg-[#966042]" style={{ width: `${products.length ? count / products.length * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <button onClick={showOrders} className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#733d29]">All orders <ArrowUpRight size={16} aria-hidden="true" /></button>
          </div>
          {orders.length ? <ul className="divide-y divide-[#eadbd0]">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex justify-between gap-3 py-3 text-sm">
                <div className="min-w-0"><p className="break-words font-semibold">{order.customerName}</p><p className="text-xs text-[#705648]">{order.orderNumber} · {order.status}</p></div>
                <span className="shrink-0 font-semibold">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul> : <p className="mt-3 text-sm text-[#705648]">Website orders will appear here after checkout.</p>}
        </section>
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Stock to review</h2>
            <button onClick={showLowStock} className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#733d29]">View stock <ArrowDownRight size={16} aria-hidden="true" /></button>
          </div>
          {lowStock.length ? <ul className="divide-y divide-[#eadbd0]">
            {lowStock.slice(0, 5).map((product) => (
              <li key={product.id}>
                <button onClick={() => editProduct(product)} className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-sm hover:underline">
                  <span className="flex min-w-0 items-center gap-2 break-words"><Package size={15} className="shrink-0 text-[#966042]" aria-hidden="true" />{product.name}</span>
                  <span className="shrink-0 text-xs font-semibold text-[#733d29]">{product.stockCount ?? 10} left</span>
                </button>
              </li>
            ))}
          </ul> : <p className="mt-3 text-sm text-[#705648]">Stock levels are healthy.</p>}
        </section>
      </div>
    </div>
  );
}
