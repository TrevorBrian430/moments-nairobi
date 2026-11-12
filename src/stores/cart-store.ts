"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProductsStore } from "@/stores/products-store";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  variantImage?: string;
  priceUpdated?: boolean;
  unavailable?: boolean;
};

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
  announcement: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setAnnouncement: (msg: string | null) => void;
  addItem: (
    item: Omit<CartItem, "quantity"> & {
      quantity?: number;
      skipOpenDrawer?: boolean;
    }
  ) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  restoreItem: (item: CartItem, index?: number) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  syncWithCatalog: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      announcement: null,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
      setAnnouncement: (msg) => set({ announcement: msg }),

      addItem: (item) => {
        const addQty = item.quantity && item.quantity > 0 ? item.quantity : 1;

        // Check catalog for latest price & variant image
        const { products, ready } = useProductsStore.getState();
        const product = ready ? products.find((p) => p.id === item.productId) : undefined;
        const resolvedPrice = product
          ? product.salePrice ?? product.price
          : item.price;
        const colorVariant = product?.colors?.find(
          (c) => c.name === item.color || c.name === item.variantLabel
        );
        const resolvedImage =
          item.variantImage ||
          colorVariant?.image ||
          item.image ||
          product?.images[0] ||
          "/images/bagpack 1.jpg";

        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.color === item.color &&
              i.size === item.size
          );

          let nextItems: CartItem[];
          if (existing) {
            nextItems = state.items.map((i) =>
              i.productId === item.productId &&
              i.color === item.color &&
              i.size === item.size
                ? {
                    ...i,
                    quantity: Math.min(
                      i.quantity + addQty,
                      product?.stockCount ?? 10
                    ),
                    price: resolvedPrice,
                    image: resolvedImage,
                    variantImage: resolvedImage,
                  }
                : i
            );
          } else {
            nextItems = [
              ...state.items,
              {
                ...item,
                price: resolvedPrice,
                image: resolvedImage,
                variantImage: resolvedImage,
                variantLabel: item.variantLabel || item.color,
                quantity: Math.min(addQty, product?.stockCount ?? 10),
              },
            ];
          }

          const sumQty = nextItems.reduce((acc, i) => acc + i.quantity, 0);

          return {
            items: nextItems,
            isDrawerOpen: item.skipOpenDrawer ? state.isDrawerOpen : true,
            announcement: `Added to cart. ${sumQty} ${
              sumQty === 1 ? "item" : "items"
            } in cart.`,
          };
        });
      },

      removeItem: (productId, color, size) => {
        set((state) => {
          const removedItem = state.items.find(
            (i) =>
              i.productId === productId &&
              i.color === color &&
              i.size === size
          );
          const nextItems = state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.color === color &&
                i.size === size
              )
          );
          const sumQty = nextItems.reduce((acc, i) => acc + i.quantity, 0);
          return {
            items: nextItems,
            announcement: removedItem
              ? `Removed ${removedItem.name} from cart. ${sumQty} items remaining.`
              : null,
          };
        });
      },

      restoreItem: (item, index) => {
        set((state) => {
          const nextItems = [...state.items];
          if (typeof index === "number" && index >= 0 && index <= nextItems.length) {
            nextItems.splice(index, 0, item);
          } else {
            nextItems.push(item);
          }
          const sumQty = nextItems.reduce((acc, i) => acc + i.quantity, 0);
          return {
            items: nextItems,
            announcement: `Restored ${item.name} to cart. ${sumQty} items in cart.`,
          };
        });
      },

      updateQuantity: (productId, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }

        const product = useProductsStore.getState().products.find((p) => p.id === productId);
        const maxStock = product?.stockCount ?? 10;
        const cappedQty = Math.min(quantity, maxStock);

        set((state) => {
          const nextItems = state.items.map((i) =>
            i.productId === productId &&
            i.color === color &&
            i.size === size
              ? { ...i, quantity: cappedQty }
              : i
          );
          return { items: nextItems };
        });
      },

      clearCart: () => set({ items: [], announcement: "Cart cleared" }),

      totalItems: () =>
        get()
          .items.filter((i) => !i.unavailable)
          .reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get()
          .items.filter((i) => !i.unavailable)
          .reduce((sum, i) => sum + i.price * i.quantity, 0),

      syncWithCatalog: () => {
        if (!useProductsStore.getState().ready) return;
        set((state) => {
          let hasChanges = false;
          const nextItems = state.items.map((item) => {
            const product = useProductsStore.getState().products.find((p) => p.id === item.productId);

            // Check if product is removed or out of stock
            if (!product || !product.inStock || (product.stockCount !== undefined && product.stockCount <= 0)) {
              if (!item.unavailable) hasChanges = true;
              return { ...item, unavailable: true };
            }

            const currentPrice = product.salePrice ?? product.price;
            const priceChanged = currentPrice !== item.price;

            // Resolve variant image if missing or mismatched
            const colorVariant = product.colors?.find(
              (c) => c.name === item.color || c.name === item.variantLabel
            );
            const resolvedImage = colorVariant?.image || product.images[0] || item.variantImage || item.image;

            if (priceChanged || item.unavailable || item.variantImage !== resolvedImage) {
              hasChanges = true;
            }

            return {
              ...item,
              price: currentPrice,
              priceUpdated: priceChanged || item.priceUpdated,
              unavailable: false,
              variantImage: resolvedImage,
              image: resolvedImage || item.image,
              variantLabel: item.variantLabel || item.color,
            };
          });

          return hasChanges ? { items: nextItems } : state;
        });
      },
    }),
    {
      name: "moments-cart",
      version: 2,
      migrate: (stored, version) => {
        const persistedState = stored as Pick<CartState, "items"> | undefined;
        if (!persistedState || !Array.isArray(persistedState.items)) return persistedState;
        if (version < 2) {
          // Upgrade old items to ensure variantImage and variantLabel exist
          const upgradedItems = persistedState.items.map((item) => {
            const product = useProductsStore.getState().products.find((p) => p.id === item.productId);
            const colorVariant = product?.colors?.find(
              (c) => c.name === item.color
            );
            return {
              ...item,
              variantId: item.color ? `${item.productId}-${item.color}` : item.productId,
              variantLabel: item.color || undefined,
              variantImage: colorVariant?.image || item.image || product?.images[0],
            };
          });
          return { ...persistedState, items: upgradedItems };
        }
        return persistedState;
      },
    }
  )
);
