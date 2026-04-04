"use client";

import { useState, useTransition } from "react";
import { updateCategoryAction } from "@/app/actions/category-actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
};

export default function EditCategoryForm({
  category,
}: {
  category: Category;
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(category.is_active);

  return (
    <form
      action={(formData) => {
        formData.set("is_active", isActive ? "true" : "false");

        startTransition(async () => {
          const result = await updateCategoryAction(formData);

          if (result?.error) {
            setMessage(result.error);
            return;
          }

          setMessage("Category updated successfully.");
        });
      }}
      className="space-y-5"
    >
      <input type="hidden" name="category_id" value={category.id} />

      {/* Category name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-white">
          Category Name
        </label>
        <input
          name="name"
          defaultValue={category.name}
          placeholder="Category name"
          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      {/* Category slug */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-white">
          Slug
        </label>
        <input
          name="slug"
          defaultValue={category.slug}
          placeholder="Slug"
          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      {/* Category status */}
      <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          Visibility
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enable this category to make it visible in the storefront.
        </p>

        <label className="mt-4 flex items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 dark:border-zinc-700"
          />
          Active category
        </label>
      </div>

      {/* Submit button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {message ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
        ) : null}
      </div>
    </form>
  );
}