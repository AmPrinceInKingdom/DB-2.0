"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminProductStatusFormProps = {
  productId: string;
  currentStatus: string;
};

const statusOptions = ["draft", "active", "archived"];

export default function AdminProductStatusForm({
  productId,
  currentStatus,
}: AdminProductStatusFormProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSave() {
    try {
      setIsPending(true);
      setMessage("");

      const response = await fetch("/api/admin/products/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          status: selectedStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Update failed.");
        return;
      }

      setMessage(result.success || "Updated.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
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
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}