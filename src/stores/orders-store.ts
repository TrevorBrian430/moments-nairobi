"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Dispatched"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryZone: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "whatsapp" | "mpesa" | "card";
  status: OrderStatus;
  createdAt: string;
}

interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: "MN-98214",
    customerName: "Dennis Mwangi",
    customerPhone: "0712345678",
    deliveryZone: "Nairobi CBD",
    deliveryAddress: "Kenyatta Ave, ICEA Building, 5th Floor",
    notes: "Please call when nearby",
    items: [
      {
        productId: "goyard-style-backpack",
        name: "Goyard-Style Backpack",
        price: 4500,
        quantity: 1,
        color: "Blue",
        image: "/images/goyard style blue.jpg",
      },
    ],
    subtotal: 4500,
    deliveryFee: 0,
    total: 4500,
    paymentMethod: "whatsapp",
    status: "Pending",
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  {
    id: "ord-102",
    orderNumber: "MN-98215",
    customerName: "Kevin Otieno",
    customerPhone: "0723456789",
    deliveryZone: "Greater Nairobi",
    deliveryAddress: "Westlands, Rhapta Road, Block B4",
    items: [
      {
        productId: "essentials-crossbody",
        name: "Essentials Crossbody Bag",
        price: 2700,
        quantity: 1,
        color: "Black",
        image: "/images/crossbody-bag.jpg",
      },
      {
        productId: "wide-leg-jeans",
        name: "Wide Leg Jeans",
        price: 2000,
        quantity: 1,
        size: "34",
        image: "/images/shacket-white.jpg",
      },
    ],
    subtotal: 4700,
    deliveryFee: 300,
    total: 5000,
    paymentMethod: "mpesa",
    status: "Confirmed",
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_DEMO_ORDERS,

      addOrder: (orderData) => {
        const id = `ord-${Date.now()}`;
        const orderNumber = `MN-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder: Order = {
          ...orderData,
          id,
          orderNumber,
          status: "Pending",
          createdAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        }));
      },
    }),
    {
      name: "moments-orders-cms",
    }
  )
);
