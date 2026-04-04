"use client";

import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export default function QuickViewModal({ open = true, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl dark:bg-zinc-950">
        
        {/* header */}
        <div className="flex items-center justify-between border-b p-4 dark:border-zinc-800">
          <h3 className="font-semibold">Quick View</h3>

          <button onClick={onClose}>
            <X className="h-5 w-5"/>
          </button>
        </div>

        {/* body */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          
          {/* image */}
          <div className="relative h-80 w-full">
            <Image
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              alt="product"
              fill
              className="object-contain"
            />
          </div>

          {/* content */}
          <div>
            <h2 className="text-xl font-bold">
              Wireless Headphones
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Electronics
            </p>

            <p className="text-2xl font-bold text-red-600 mt-3">
              Rs 24,500
            </p>

            <p className="text-sm mt-3 text-zinc-600 dark:text-zinc-400">
              Clean premium headphones with noise canceling and
              long battery life.
            </p>

            <div className="flex gap-3 mt-6">
              
              <button className="bg-red-600 text-white px-5 py-2 rounded-full flex items-center gap-2">
                <ShoppingCart className="h-4 w-4"/>
                Add to cart
              </button>

              <button className="border px-5 py-2 rounded-full dark:border-zinc-800">
                Wishlist
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}