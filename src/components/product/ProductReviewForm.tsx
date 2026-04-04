"use client";

import { useState, useTransition } from "react";
import FormMessage from "@/components/shared/FormMessage";
import { submitProductReviewAction } from "@/app/actions/review-actions";

export default function ProductReviewForm({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");
        formData.set("rating", String(rating));
        formData.set("product_slug", productSlug);

        startTransition(async () => {
          const result = await submitProductReviewAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Review submitted.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input type="hidden" name="product_id" value={productId} />

      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
          Write a Review
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Share your experience with this product.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-900 dark:text-white">
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-900 dark:text-white">
          Comment
        </label>
        <textarea
          name="comment"
          rows={4}
          placeholder="Write your review here..."
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>

      {message ? <FormMessage type={messageType} message={message} /> : null}
    </form>
  );
}