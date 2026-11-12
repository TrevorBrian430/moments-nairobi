import { Suspense } from "react";
import { connection } from "next/server";
import { isAdmin, adminConfigured } from "@/lib/admin-auth";
import { readStore } from "@/lib/store-db";
import { deliveryTowns } from "@/lib/delivery-fees";
import AdminDashboard from "./AdminDashboard";
import AdminSignIn from "./AdminSignIn";

async function AdminAccess() {
  await connection();
  if (await isAdmin()) {
    const { categories, products, orders, deliveryFees } = readStore();
    return <AdminDashboard initialCategories={categories} initialProducts={products} initialOrders={orders} initialTowns={deliveryTowns(deliveryFees)} />;
  }
  return <AdminSignIn configured={adminConfigured()} />;
}

export default function AdminPage() {
  return <Suspense fallback={<p className="p-8 text-[#705648]">Loading admin…</p>}><AdminAccess /></Suspense>;
}
