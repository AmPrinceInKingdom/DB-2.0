"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin-order-actions";

type AdminOrderStatusFormProps = {
  orderId: string;
  currentStatus: string;
};

const statusOptions = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderStatusForm({
  orderId,
  currentStatus,
}: AdminOrderStatusFormProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");

        startTransition(async () => {
          const result = await updateOrderStatusAction(formData);

          if (result?.error) {
            setMessage(result.error);
            return;
          }

          setMessage(result?.success || "Updated.");
        });
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input type="hidden" name="order_id" value={orderId} />

      <select
        name="order_status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Update"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </form>
  );
}