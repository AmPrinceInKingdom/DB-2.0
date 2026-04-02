"use client";

import { useState, useTransition } from "react";
import { markAllNotificationsAsReadAction } from "@/app/actions/notification-actions";

export default function MarkAllNotificationsReadButton() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setMessage("");

          startTransition(async () => {
            const result = await markAllNotificationsAsReadAction();
            setMessage(result?.error || result?.success || "");
          });
        }}
        className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
      >
        {isPending ? "Updating..." : "Mark all as read"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}