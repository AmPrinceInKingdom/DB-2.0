"use client";

import { useState, useTransition } from "react";
import { createCategoryAction } from "@/app/actions/category-actions";

export default function AddCategoryForm() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(true);

  return (
    <form
      action={(formData) => {
        formData.set("is_active", isActive ? "true" : "false");

        startTransition(async () => {
          const result = await createCategoryAction(formData);

          if (result?.error) {
            setMessage(result.error);
            return;
          }

          setMessage("Category created");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
        Add Category
      </h2>

      <input
        name="name"
        placeholder="Category name"
        className="w-full rounded-xl border px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950"
      />

      <input
        name="slug"
        placeholder="Slug (optional)"
        className="w-full rounded-xl border px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-red-600 px-4 py-2 text-white"
      >
        {isPending ? "Creating..." : "Create Category"}
      </button>

      {message && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {message}
        </p>
      )}
    </form>
  );
}