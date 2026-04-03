"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/auth/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
      disabled={isPending}
      className="rounded-xl border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}