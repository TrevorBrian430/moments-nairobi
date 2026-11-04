"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "@/lib/constants";

interface ProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      products: PRODUCTS,

      addProduct: (newProduct) =>
        set((state) => ({
          products: [newProduct, ...state.products],
        })),

      updateProduct: (id, updatedFields) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      resetToDefaults: () => set({ products: PRODUCTS }),
    }),
    {
      name: "moments-products-cms",
    }
  )
);
