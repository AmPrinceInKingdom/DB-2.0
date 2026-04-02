"use client";

import { ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart-actions";

type AddToCartButtonProps = {
  productId: string;
  quantity: number;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  quantity,
  disabled = false,
}: AddToCartButtonProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    setMessage("");

    startTransition(async () => {
      const result = await addToCartAction({
        productId,
        quantity,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage(result.success || "Added to cart.");
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        <ShoppingCart className="mr-2 h-4.5 w-4.5" />
        {isPending ? "Adding..." : "Add to cart"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}