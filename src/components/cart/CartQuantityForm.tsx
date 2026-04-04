"use client";

import { Minus, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { updateCartItemQuantityAction } from "@/app/actions/cart-item-actions";

type CartQuantityFormProps = {
  cartItemId: string;
  initialQuantity: number;
};

export default function CartQuantityForm({
  cartItemId,
  initialQuantity,
}: CartQuantityFormProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submitQuantity = (nextQuantity: number) => {
    const safeQuantity = Math.max(1, nextQuantity);
    setQuantity(safeQuantity);
    setMessage("");

    const formData = new FormData();
    formData.set("cart_item_id", cartItemId);
    formData.set("quantity", String(safeQuantity));

    startTransition(async () => {
      const result = await updateCartItemQuantityAction(formData);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      setMessage("");
    });
  };

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => submitQuantity(quantity - 1)}
          disabled={isPending}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="inline-flex min-w-[42px] items-center justify-center text-sm font-semibold text-zinc-900 dark:text-white">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => submitQuantity(quantity + 1)}
          disabled={isPending}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}