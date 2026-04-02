"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WishlistItem = {
  id: number | string;
  name: string;
  slug?: string;
  price: string | number;
  oldPrice?: string | number;
  image: string;
  category?: string;
  description?: string;
  inStock?: boolean;
};

type WishlistStore = {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number | string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number | string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        const exists = get().items.some(
          (wishlistItem) => String(wishlistItem.id) === String(item.id)
        );

        if (exists) return;

        set((state) => ({
          items: [item, ...state.items],
        }));
      },

      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => String(item.id) !== String(id)
          ),
        })),

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (id) => {
        return get().items.some(
          (item) => String(item.id) === String(id)
        );
      },
    }),
    {
      name: "deal-bazaar-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);