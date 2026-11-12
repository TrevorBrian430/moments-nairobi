"use client";

import { create } from "zustand";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/lib/constants";
import { POLICIES, type DeliveryTown } from "@/config/policies";

interface ProductsState {
  products: Product[];
  categories: Category[];
  towns: DeliveryTown[];
  ready: boolean;
}

export const useProductsStore = create<ProductsState>(() => ({
  products: PRODUCTS,
  categories: CATEGORIES,
  towns: POLICIES.delivery.towns,
  ready: false,
}));

let pending: Promise<void> | undefined;

export function refreshCatalog() {
  pending ??= fetch("/api/catalog", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Could not load the catalog.");
      const { categories, products, towns } = await response.json();
      useProductsStore.setState({ categories, products, towns, ready: true });
    })
    .finally(() => { pending = undefined; });
  return pending;
}
