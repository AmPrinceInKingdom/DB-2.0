"use client";

import { useState, useTransition } from "react";
import FormMessage from "@/components/shared/FormMessage";
import { cancelOrderAction } from "@/app/actions/order-cancel-actions";

export default function CancelOrderButton({
  orderId,
}: {
  orderId: string;
}) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
        Cancel Order
      </h3>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="Optional cancellation reason"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const fd = new FormData();
          fd.set("order_id", orderId);
          fd.set("cancel_reason", reason);

          startTransition(async () => {
            const result = await cancelOrderAction(fd);

            if (result?.error) {
              setMessageType("error");
              setMessage(result.error);
              return;
            }

            setMessageType("success");
            setMessage(result?.success || "Order cancelled.");
          });
        }}
        className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Cancelling..." : "Cancel Order"}
      </button>

      {message ? <FormMessage type={messageType} message={message} /> : null}
    </div>
  );
}