"use client";

import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
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
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="order_id" value={orderId} />

      <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Upload payment proof
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Upload a clear image of your bank transfer slip in PNG, JPEG, or
              WEBP format.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Slip image
        </label>

        <div className="rounded-[22px] border border-border/70 bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImagePlus className="h-5 w-5" />
            </div>

            <input
              type="file"
              name="file"
              accept="image/png,image/jpeg,image/webp"
              className="block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Note
        </label>
        <textarea
          name="note"
          rows={4}
          className="w-full rounded-[22px] border border-border/70 bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
          placeholder="Optional note about your payment"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload Payment Proof"
        )}
      </button>

      {message ? (
        <div className="rounded-[18px] border border-border/70 bg-muted/20 px-4 py-3">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      ) : null}
    </form>
  );
}