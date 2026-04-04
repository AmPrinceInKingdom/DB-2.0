"use client";

import { useTransition } from "react";
import { deleteProductImageAction } from "@/app/actions/product-image-actions";

export default function DeleteProductImageButton({
  imageId,
  productId,
}: {
  imageId: string;
  productId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        const formData = new FormData();
        formData.set("image_id", imageId);
        formData.set("product_id", productId);

        startTransition(async () => {
          await deleteProductImageAction(formData);
        });
      }}
      disabled={isPending}
      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}