"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
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
    <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
      <div className="border-b border-border/70 bg-muted/30 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground">
              Cancel Order
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Cancel this order only if you no longer want the items.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Cancellation reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Optional cancellation reason"
            className="w-full rounded-[22px] border border-border/70 bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
          />
        </div>

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
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            "Cancel Order"
          )}
        </button>

        {message ? <FormMessage type={messageType} message={message} /> : null}
      </div>
    </div>
  );
}