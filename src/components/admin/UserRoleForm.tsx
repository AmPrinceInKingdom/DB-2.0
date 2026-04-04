"use client";

import { useState, useTransition } from "react";
import { updateUserRoleAction } from "@/app/actions/admin-user-actions";

export default function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="customer">customer</option>
          <option value="seller">seller</option>
          <option value="admin">admin</option>
        </select>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const fd = new FormData();
            fd.set("user_id", userId);
            fd.set("role", role);

            startTransition(async () => {
              const result = await updateUserRoleAction(fd);
              setMessage(result?.error || result?.success || "");
            });
          }}
          className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
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