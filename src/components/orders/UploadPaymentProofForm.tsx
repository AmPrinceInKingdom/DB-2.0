"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type UploadPaymentProofFormProps = {
  orderId: string;
};

export default function UploadPaymentProofForm({
  orderId,
}: UploadPaymentProofFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setIsPending(true);
      setMessage("");

      const response = await fetch("/api/payment-proofs/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Upload failed.");
        return;
      }

      setMessage(result.success || "Payment proof uploaded successfully.");
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
    <form action={handleSubmit} className="mt-5 space-y-4">
      <input type="hidden" name="order_id" value={orderId} />

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
          Upload slip image
        </label>
        <input
          type="file"
          name="file"
          accept="image/png,image/jpeg,image/webp"
          className="block w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
          Note
        </label>
        <textarea
          name="note"
          rows={3}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="Optional note about your payment"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Upload Payment Proof"}
      </button>

      {message ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </form>
  );
}