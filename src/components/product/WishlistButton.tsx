"use client";

import { useTransition } from "react";
import { toggleWishlistAction } from "@/app/actions/wishlist-actions";

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          toggleWishlistAction(formData);
        });
      }}
    >
      <input type="hidden" name="product_id" value={productId} />

      <button
        disabled={isPending}
        className="rounded-full border border-zinc-300 p-2 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        ❤️
      </button>
    </form>
  );
}