"use client";

import { useState, useTransition } from "react";
import { toggleUserBlockedAction } from "@/app/actions/admin-user-actions";

export default function BlockUserButton({
  userId,
  isBlocked,
}: {
  userId: string;
  isBlocked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const fd = new FormData();
          fd.set("user_id", userId);
          fd.set("next_blocked", isBlocked ? "false" : "true");

          startTransition(async () => {
            const result = await toggleUserBlockedAction(fd);
            setMessage(result?.error || result?.success || "");
          });
        }}
        className={`rounded-xl px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
          isBlocked ? "bg-green-600" : "bg-zinc-800"
        }`}
      >
        {isPending ? "Saving..." : isBlocked ? "Unblock" : "Block"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}