"use client";

import { useState, useTransition } from "react";
import { createCouponAction } from "@/app/actions/coupon-actions";
import FormMessage from "@/components/shared/FormMessage";

export default function AddCouponForm() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isActive, setIsActive] = useState(true);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");
        formData.set("is_active", isActive ? "true" : "false");

        startTransition(async () => {
          const result = await createCouponAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Coupon created.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
        Add Coupon
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="code"
          placeholder="Code (e.g. SAVE500)"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <select
          name="discount_type"
          defaultValue="fixed"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="fixed">fixed</option>
          <option value="percent">percent</option>
        </select>

        <input
          name="discount_value"
          type="number"
          step="0.01"
          placeholder="Discount value"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="min_order_amount"
          type="number"
          step="0.01"
          placeholder="Minimum order amount"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="usage_limit"
          type="number"
          placeholder="Usage limit (optional)"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="expires_at"
          type="datetime-local"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Coupon"}
      </button>

      {message ? <FormMessage type={messageType} message={message} /> : null}
    </form>
  );
}