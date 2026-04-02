"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order } from "@/types";

type CreateOrderInput = Omit<Order, "id" | "orderNumber" | "createdAt" | "total"> & {
  subtotal: number;
  shipping: number;
  discount: number;
};

type OrderStore = {
  orders: Order[];
  latestOrder: Order | null;
  hasHydrated: boolean;

  createOrder: (order: CreateOrderInput) => Order;
  addOrder: (order: Order) => void;

  setOrders: (orders: Order[]) => void;
  setLatestOrder: (order: Order | null) => void;
  updateOrderStatus: (orderNumber: string, status: string) => void;

  clearOrders: () => void;
  clearLatestOrder: () => void;

  setHasHydrated: (value: boolean) => void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      latestOrder: null,
      hasHydrated: false,

      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `order-${Date.now()}`,
          orderNumber: `DB-${Date.now()}`,
          createdAt: new Date().toISOString(),
          total: orderData.subtotal + orderData.shipping - orderData.discount,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          latestOrder: newOrder,
        }));

        return newOrder;
      },

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
          latestOrder: order,
        })),

      setOrders: (orders) => set({ orders }),

      setLatestOrder: (order) => set({ latestOrder: order }),

      updateOrderStatus: (orderNumber, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderNumber === orderNumber
              ? ({ ...order, status } as Order)
              : order
          ),
          latestOrder:
            state.latestOrder?.orderNumber === orderNumber
              ? ({ ...state.latestOrder, status } as Order)
              : state.latestOrder,
        })),

      clearOrders: () => set({ orders: [] }),

      clearLatestOrder: () => set({ latestOrder: null }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "deal-bazaar-order-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        latestOrder: state.latestOrder,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);