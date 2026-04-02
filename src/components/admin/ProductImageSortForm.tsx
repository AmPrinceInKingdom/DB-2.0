"use client";

import { useState, useTransition } from "react";
import { updateProductImageSortOrderAction } from "@/app/actions/product-image-actions";

export default function ProductImageSortForm({
  imageId,
  productId,
  initialSortOrder,
}: {
  imageId: string;
  productId: string;
  initialSortOrder: number;
}) {
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
        className="w-20 rounded-lg border border-zinc-300 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <button
        type="button"
        onClick={() => {
          const formData = new FormData();
          formData.set("image_id", imageId);
          formData.set("product_id", productId);
          formData.set("sort_order", String(sortOrder));

          startTransition(async () => {
            await updateProductImageSortOrderAction(formData);
          });
        }}
        disabled={isPending}
        className="rounded-lg border px-3 py-2 text-xs font-semibold dark:border-zinc-700 dark:text-white"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}