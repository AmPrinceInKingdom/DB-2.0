"use client";

import { useTransition } from "react";
import { markNotificationAsReadAction } from "@/app/actions/notification-actions";

export default function MarkNotificationReadButton({
  notificationId,
  isRead,
}: {
  notificationId: string;
  isRead: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (isRead) {
    return (
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        Read
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const fd = new FormData();
        fd.set("notification_id", notificationId);

        startTransition(async () => {
          await markNotificationAsReadAction(fd);
        });
      }}
      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? "Saving..." : "Mark as read"}
    </button>
  );
}