"use client";

import Link from "next/link";
import {
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";

type ProductInfoProps = {
  id: string | number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  description: string;
  rating?: number;
  reviews?: number;
  sku?: string;
  highlights?: string[];
  stockQuantity?: number;
};

export default function ProductInfo({
  id,
  name,
  category,
  price,
  oldPrice,
  description,
  rating = 4.8,
  reviews = 120,
  sku = "DB-001",
  highlights = [],
  stockQuantity = 0,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const inStock = stockQuantity > 0;

  // Prevent quantity from going below 1.
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Prevent quantity from going above available stock when stock exists.
  const increaseQuantity = () => {
    setQuantity((prev) => {
      if (!inStock) return 1;
      if (stockQuantity > 0) {
        return prev < stockQuantity ? prev + 1 : prev;
      }
      return prev + 1;
    });
  };

  // Show a small savings label only when an old price exists.
  const priceLabel = useMemo(() => {
    return oldPrice ? "Limited deal" : "Ready to order";
  }, [oldPrice]);

  return (
    <div className="space-y-5">
      {/* Main product information panel */}
      <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {/* Top content */}
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Product meta row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {category}
            </span>

            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  {rating.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <span>{reviews} reviews</span>
            </div>
          </div>

          {/* Product title */}
          <h1 className="mt-4 text-[28px] font-black tracking-tight text-zinc-900 dark:text-white sm:text-[34px]">
            {name}
          </h1>

          {/* Product description */}
          <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[15px]">
            {description}
          </p>

          {/* Price section */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-[34px] font-black tracking-tight text-zinc-900 dark:text-white">
              {price}
            </span>

            {oldPrice ? (
              <span className="text-lg text-zinc-400 line-through dark:text-zinc-500">
                {oldPrice}
              </span>
            ) : null}

            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {priceLabel}
            </span>
          </div>

          {/* Product info mini cards */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                Product code
              </p>
              <p className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-white">
                {sku}
              </p>
            </div>

            <div className="rounded-[22px] bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                Availability
              </p>
              <p
                className={`mt-1.5 text-sm font-semibold ${
                  inStock
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {inStock ? `In stock (${stockQuantity})` : "Out of stock"}
              </p>
            </div>
          </div>

          {/* Product highlights */}
          {highlights.length > 0 ? (
            <div className="mt-6 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Product highlights
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white px-3 py-3 text-sm leading-6 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Action area */}
        <div className="border-t border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Quantity + wishlist */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex w-fit items-center rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="inline-flex min-w-[48px] items-center justify-center text-sm font-bold text-zinc-900 dark:text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={!inStock}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <WishlistButton productId={String(id)} />
            </div>

            {/* Main actions */}
            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                productId={String(id)}
                quantity={quantity}
                disabled={!inStock}
              />

              <Link
                href="/checkout"
                className={`inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition ${
                  inStock
                    ? "bg-red-600 hover:bg-red-700"
                    : "pointer-events-none bg-zinc-300 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Buy now
              </Link>
            </div>

            {/* Small helper note */}
            <p className="text-xs leading-6 text-zinc-500 dark:text-zinc-400">
              {inStock
                ? "Add to cart or continue directly to checkout with your selected quantity."
                : "This product is currently unavailable. Please check again later."}
            </p>
          </div>
        </div>
      </div>

      {/* Trust / support cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Truck className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
            Fast delivery
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Clean ordering flow with reliable delivery support.
          </p>
        </div>

        <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
            Secure shopping
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Simple design helps users understand pricing clearly.
          </p>
        </div>

        <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
            Easy returns
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Friendly product experience with less confusion.
          </p>
        </div>
      </div>
    </div>
  );
}