"use client";

import { useState, useTransition } from "react";
import { addProductImageAction } from "@/app/actions/product-image-actions";

export default function AddProductImageForm({
  productId,
  currentCount,
}: {
  productId: string;
  currentCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const maxExtraImages = 4;
  const canAddMore = currentCount < maxExtraImages;

  async function handleUpload(file: File | null) {
    if (!file) return;

    if (!canAddMore) {
      setMessage("Maximum 4 extra gallery images allowed.");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      setMessage("");

      const uploadResponse = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setMessage(uploadResult.error || "Upload failed.");
        return;
      }

      const fd = new FormData();
      fd.set("product_id", productId);
      fd.set("image_url", uploadResult.imageUrl);

      startTransition(async () => {
        const result = await addProductImageAction(fd);

        if (result?.error) {
          setMessage(result.error);
          return;
        }

        setMessage(result?.success || "Image added.");
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label
          className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium ${
            canAddMore
              ? "border-zinc-300 dark:border-zinc-700 dark:text-white"
              : "cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-800"
          }`}
        >
          {isPending ? "Adding..." : "Upload Gallery Image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={!canAddMore || isPending}
            onChange={(e) => handleUpload(e.target.files?.[0] || null)}
          />
        </label>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Extra images: {currentCount} / 4
        </p>
      </div>

      {message ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}