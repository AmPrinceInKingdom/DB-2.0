"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

const items = [
  {
    id: 1,
    name: "Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    id: 2,
    name: "Gaming Mouse",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
  },
];

export default function CompareDrawer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-3">
        
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 overflow-x-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-zinc-800"
              >
                <div className="relative h-8 w-8">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <span className="text-sm whitespace-nowrap">
                  {item.name}
                </span>

                <button className="text-zinc-400 hover:text-red-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/compare"
              className="bg-red-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Compare
            </Link>

            <button className="border px-4 py-2 rounded-full text-sm dark:border-zinc-800">
              Clear
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}