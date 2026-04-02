"use client";

import { useState, useTransition } from "react";
import { toggleFeaturedProductAction } from "@/app/actions/admin-product-actions";

type AdminFeaturedToggleFormProps = {
  productId: string;
  isFeatured: boolean;
};

export default function AdminFeaturedToggleForm({
  productId,
  isFeatured,
}: AdminFeaturedToggleFormProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");

        startTransition(async () => {
          const result = await toggleFeaturedProductAction(formData);

          if (result?.error) {
            setMessage(result.error);
            return;
          }

          setMessage(result?.success || "Updated.");
        });
      }}
      className="space-y-2"
    >
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="next_value" value={String(!isFeatured)} />

      <button
        type="submit"
        disabled={isPending}
        className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isFeatured ? "bg-zinc-700 hover:bg-zinc-800" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isPending
          ? "Updating..."
          : isFeatured
          ? "Remove Featured"
          : "Make Featured"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </form>
  );
}