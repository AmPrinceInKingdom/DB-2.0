"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCompareStore } from "@/store/compare-store";

export default function ComparePageView() {
  const { items, removeItem, clear } = useCompareStore();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <Scale className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No products to compare
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add products to compare them side by side.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Product comparison
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Compare Products
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Compare selected items side by side and review the main details
              before choosing one.
            </p>
          </div>

          <button
            onClick={clear}
            className="inline-flex h-11 items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Product cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="relative p-4">
              <button
                onClick={() => removeItem(product.id)}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                aria-label={`Remove ${product.name} from compare`}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative h-44 w-full overflow-hidden rounded-[18px] bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={product.image || "/images/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              <h3 className="mt-4 line-clamp-2 text-base font-bold text-zinc-900 dark:text-white">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {product.category || "General"}
              </p>

              <p className="mt-3 text-xl font-black text-red-600">
                Rs. {Number(product.price || 0).toLocaleString()}
              </p>

              <div className="mt-4 grid gap-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[700px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Comparison Table
            </h2>
          </div>

          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="w-44 bg-zinc-50 px-5 py-4 font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white">
                  Price
                </td>
                {items.map((p) => (
                  <td
                    key={`${p.id}-price`}
                    className="px-5 py-4 text-zinc-700 dark:text-zinc-300"
                  >
                    Rs. {Number(p.price || 0).toLocaleString()}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="bg-zinc-50 px-5 py-4 font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white">
                  Category
                </td>
                {items.map((p) => (
                  <td
                    key={`${p.id}-category`}
                    className="px-5 py-4 text-zinc-700 dark:text-zinc-300"
                  >
                    {p.category || "-"}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="bg-zinc-50 px-5 py-4 font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white">
                  Availability
                </td>
                {items.map((p) => (
                  <td
                    key={`${p.id}-stock`}
                    className="px-5 py-4 text-zinc-700 dark:text-zinc-300"
                  >
                    {p.inStock ? "In stock" : "Out of stock"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="bg-zinc-50 px-5 py-4 font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white">
                  Description
                </td>
                {items.map((p) => (
                  <td
                    key={`${p.id}-description`}
                    className="px-5 py-4 text-zinc-700 dark:text-zinc-300"
                  >
                    {p.description || "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}