"use client";

import { useState, useTransition } from "react";
import { createProductAction } from "@/app/actions/admin-product-create-actions";
import FormMessage from "@/components/shared/FormMessage";
import AdminImageUploader from "@/components/admin/AdminImageUploader";

type Category = {
  id: string;
  name: string;
};

type AdminAddProductFormProps = {
  categories: Category[];
};

export default function AdminAddProductForm({
  categories,
}: AdminAddProductFormProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");
        formData.set("thumbnail_url", thumbnailUrl);

        startTransition(async () => {
          const result = await createProductAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Product created.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Add Product
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Create a new product for Deal Bazaar.
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
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          defaultValue=""
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

        <select
          name="status"
          defaultValue="draft"
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
        placeholder="Short description"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <textarea
        name="description"
        rows={4}
        placeholder="Full description"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <label className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" name="is_featured" value="true" />
        Make featured
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Product"}
      </button>

      {message ? (
        <FormMessage type={messageType} message={message} />
      ) : null}
    </form>
  );
}