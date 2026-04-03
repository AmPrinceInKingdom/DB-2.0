"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export type CartProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  image: string;
};

type CartItemListProps = {
  items: CartProduct[];
};

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString()}`;
}

export default function CartItemList({ items }: CartItemListProps) {
  const [cartItems, setCartItems] = useState<CartProduct[]>(items);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const updateQuantity = (id: number, type: "increase" | "decrease") => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (type === "decrease") {
          return {
            ...item,
            quantity: item.quantity > 1 ? item.quantity - 1 : 1,
          };
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-2 border-b border-zinc-200 px-5 py-5 dark:border-zinc-800 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Cart items
          </h2>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {itemCount} items
          </span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Clean product list with simple controls and better spacing.
        </p>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {cartItems.length === 0 ? (
          <div className="px-5 py-10 text-center sm:px-6">
            <p className="text-base font-semibold text-zinc-900 dark:text-white">
              Your cart is empty
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Add products to start your order.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Browse products
            </Link>
          </div>
        ) : (
          cartItems.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={item.id}
                className="px-5 py-5 sm:px-6 sm:py-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/product/${item.id}`}
                    className="relative block h-28 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 sm:h-28 sm:w-28"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 112px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {item.category}
                        </p>

                        <Link href={`/product/${item.id}`}>
                          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-zinc-900 transition hover:text-red-600 dark:text-white dark:hover:text-red-400">
                            {item.name}
                          </h3>
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                            {formatCurrency(item.price)}
                          </span>
                          {item.oldPrice ? (
                            <span className="text-sm text-zinc-400 line-through dark:text-zinc-500">
                              {formatCurrency(item.oldPrice)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Total
                        </p>
                        <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex w-fit items-center rounded-full border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, "decrease")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white dark:text-zinc-200 dark:hover:bg-zinc-800"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="inline-flex min-w-[40px] items-center justify-center text-sm font-semibold text-zinc-900 dark:text-white">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, "increase")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white dark:text-zinc-200 dark:hover:bg-zinc-800"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}