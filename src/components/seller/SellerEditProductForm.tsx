"use client";

import { useState, useTransition } from "react";
import { updateSellerProductAction } from "@/app/actions/seller-product-update-actions";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  status: string;
  thumbnail_url: string | null;
  category_id: string | null;
};

export default function SellerEditProductForm({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState(product.thumbnail_url || "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");
        formData.set("thumbnail_url", thumbnailUrl);

        startTransition(async () => {
          const result = await updateSellerProductAction(formData);

          if (result?.error) {
            setMessage(result.error);
            return;
          }

          setMessage(result?.success || "Product updated.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input type="hidden" name="product_id" value={product.id} />

      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Edit Seller Product
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update your product details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          defaultValue={product.name}
          placeholder="Product name"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="slug"
          defaultValue={product.slug}
          placeholder="Slug"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="sku"
          defaultValue={product.sku || ""}
          placeholder="SKU"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <select
          name="category_id"
          defaultValue={product.category_id || ""}
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
          defaultValue={product.price}
          placeholder="Price"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="compare_at_price"
          type="number"
          step="0.01"
          defaultValue={product.compare_at_price ?? ""}
          placeholder="Compare price"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="stock_quantity"
          type="number"
          defaultValue={product.stock_quantity}
          placeholder="Stock quantity"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <select
          name="status"
          defaultValue={product.status}
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="draft">draft</option>
          <option value="active">active</option>
          <option value="archived">archived</option>
        </select>
      </div>

      <AdminImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />

      <textarea
        name="short_description"
        rows={2}
        defaultValue={product.short_description || ""}
        placeholder="Short description"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <textarea
        name="description"
        rows={5}
        defaultValue={product.description || ""}
        placeholder="Full description"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>

      {message ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </form>
  );
}