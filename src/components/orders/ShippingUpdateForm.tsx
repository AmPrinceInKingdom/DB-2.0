"use client";

import { useState, useTransition } from "react";
import FormMessage from "@/components/shared/FormMessage";
import { updateOrderShippingAction } from "@/app/actions/shipping-actions";

export default function ShippingUpdateForm({
  orderId,
  initialCourierName,
  initialTrackingNumber,
  initialOrderStatus,
}: {
  orderId: string;
  initialCourierName?: string | null;
  initialTrackingNumber?: string | null;
  initialOrderStatus?: string | null;
}) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");

        startTransition(async () => {
          const result = await updateOrderShippingAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Shipping updated.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input type="hidden" name="order_id" value={orderId} />

      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
          Shipping Details
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update courier, tracking number, and shipping status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="courier_name"
          defaultValue={initialCourierName || ""}
          placeholder="Courier name"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="tracking_number"
          defaultValue={initialTrackingNumber || ""}
          placeholder="Tracking number"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <select
        name="order_status"
        defaultValue={initialOrderStatus || "processing"}
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      >
        <option value="processing">processing</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
      </select>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Shipping"}
      </button>

      {message ? <FormMessage type={messageType} message={message} /> : null}
    </form>
  );
}