"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import { useCompareStore } from "@/store/compare-store";

export default function CompareBar() {
  const items = useCompareStore((state) => state.items);
  const clear = useCompareStore((state) => state.clear);
  const maxItems = useCompareStore((state) => state.maxItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-1rem)] max-w-3xl -translate-x-1/2 rounded-[24px] border border-red-200 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:bottom-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <Scale className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {items.length} product{items.length > 1 ? "s" : ""} selected for compare
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Compare up to {maxItems} products side by side
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Clear
          </button>

          <Link
            href="/compare"
            className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition ${
              items.length < 2
                ? "pointer-events-none bg-zinc-300 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}