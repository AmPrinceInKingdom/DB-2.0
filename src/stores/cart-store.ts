"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string | number;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
  category?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;

  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;

  updateQuantity: (id: string | number, quantity: number) => void;

  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

function getNumericPrice(value: number | string) {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/[^\d.]/g, "")) || 0;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => String(i.id) === String(item.id)
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                String(i.id) === String(item.id)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (i) => String(i.id) !== String(id)
          ),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            String(i.id) === String(id)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              String(i.id) === String(id)
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            String(i.id) === String(id)
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((t, i) => t + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (t, i) => t + getNumericPrice(i.price) * i.quantity,
          0
        ),
    }),
    {
      name: "deal-bazaar-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);