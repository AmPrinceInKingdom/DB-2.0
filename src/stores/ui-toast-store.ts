"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "info" | "warning" | "error";

export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastStore = {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: number) => void;
  clearToasts: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }));
    }, 2500);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));