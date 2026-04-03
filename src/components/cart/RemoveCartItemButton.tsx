"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { removeCartItemAction } from "@/app/actions/cart-item-actions";

type RemoveCartItemButtonProps = {
  cartItemId: string;
};

export default function RemoveCartItemButton({
  cartItemId,
}: RemoveCartItemButtonProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    setMessage("");

    const formData = new FormData();
    formData.set("cart_item_id", cartItemId);

    startTransition(async () => {
      const result = await removeCartItemAction(formData);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      setMessage("");
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Removing..." : "Remove"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}