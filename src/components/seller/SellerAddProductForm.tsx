"use client";

import { useState, useTransition } from "react";
import { createSellerProductAction } from "@/app/actions/seller-product-actions";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

type Category = {
  id: string;
  name: string;
};

export default function SellerAddProductForm({
  categories,
}: {
  categories: Category[];
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");
        formData.set("thumbnail_url", thumbnailUrl);

        startTransition(async () => {
          const result = await createSellerProductAction(formData);

          if (result?.error) {
            setMessage(result.error);
            return;
          }

          setMessage(result?.success || "Product created.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Add Seller Product
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Create a new product under your seller account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          placeholder="Product name"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="slug"
          placeholder="Slug (optional)"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="sku"
          placeholder="SKU"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <select
          name="category_id"
          defaultValue=""
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="compare_at_price"
          type="number"
          step="0.01"
          placeholder="Compare price"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="stock_quantity"
          type="number"
          placeholder="Stock quantity"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <AdminImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />

      <textarea
        name="short_description"
        rows={2}
        placeholder="Short description"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <textarea
        name="description"
        rows={5}
        placeholder="Full description"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Product"}
      </button>

      {message ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </form>
  );
}