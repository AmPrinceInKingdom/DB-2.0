"use client";

import { deleteCategoryAction } from "@/app/actions/category-actions";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string;
}) {
  return (
    <form action={deleteCategoryAction}>
      <input type="hidden" name="category_id" value={categoryId} />

      <button
        type="submit"
        className="rounded border px-3 py-1 text-sm text-red-600 dark:border-zinc-700"
      >
        Delete
      </button>
    </form>
  );
}