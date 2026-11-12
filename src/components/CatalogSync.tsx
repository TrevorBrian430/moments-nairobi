"use client";

import { useEffect } from "react";
import { refreshCatalog } from "@/stores/products-store";
import { useCartStore } from "@/stores/cart-store";

export default function CatalogSync() {
  useEffect(() => {
    function sync() {
      void refreshCatalog().then(() => useCartStore.getState().syncWithCatalog()).catch(console.error);
    }
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  return null;
}
