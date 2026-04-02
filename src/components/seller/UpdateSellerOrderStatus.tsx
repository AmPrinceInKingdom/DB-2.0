"use client";

import { useState, useTransition } from "react";
import { updateSellerOrderStatus } from "@/app/actions/seller-order-actions";
import FormMessage from "@/components/shared/FormMessage";

export default function UpdateSellerOrderStatus({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  return (
    <form
      action={(formData) => {
        setMessage("");

        start(async () => {
          const result = await updateSellerOrderStatus(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Updated.");
        });
      }}
      className="space-y-3"
    >
      <input type="hidden" name="order_id" value={orderId} />

      <select
        name="status"
        defaultValue={status}
        className="rounded-xl border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      >
        <option value="pending">pending</option>
        <option value="processing">processing</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
      </select>

      <button
        disabled={pending}
        className="rounded-xl bg-red-500 px-4 py-2 text-white"
      >
        {pending ? "Updating..." : "Update Status"}
      </button>

      {message ? (
        <FormMessage type={messageType} message={message} />
      ) : null}
    </form>
  );
}