"use client";

import { X } from "lucide-react";
import Link from "next/link";
import CartDrawerItem, { DrawerCartItem } from "@/components/cart/CartDrawerItem";

type CartDrawerProps = {
  isOpen?: boolean;
};

const drawerItems: DrawerCartItem[] = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 24500,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Premium Travel Backpack",
    price: 15200,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
];

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString()}`;
}

export default function CartDrawer({ isOpen = false }: CartDrawerProps) {
  const subtotal = drawerItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-[70] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-zinc-950 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Quick cart
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
              Your selected items
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            aria-label="Close cart"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-4">
            {drawerItems.map((item) => (
              <CartDrawerItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-200 p-5 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Subtotal
            </span>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="space-y-3">
            <Link
              href="/cart"
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              View cart
            </Link>

            <Link
              href="/checkout"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Checkout now
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}