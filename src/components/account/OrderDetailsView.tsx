"use client";

import Link from "next/link";
import { CheckCircle, Package, Truck } from "lucide-react";

type Props = {
  orderNumber: string;
};

const items = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "Rs 12,500",
    qty: 1,
  },
  {
    id: 2,
    name: "Gaming Mouse",
    price: "Rs 6,500",
    qty: 2,
  },
];

export default function OrderDetailsView({ orderNumber }: Props) {
  return (
    <div className="space-y-6">
      
      {/* order status */}
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          <div>
            <p className="text-sm text-zinc-500">Order number</p>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {orderNumber}
            </h2>
          </div>

          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
            Delivered
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          
          <div>
            <Package className="mx-auto h-5 w-5 text-red-600"/>
            <p className="text-xs mt-2">Order placed</p>
          </div>

          <div>
            <Truck className="mx-auto h-5 w-5 text-red-600"/>
            <p className="text-xs mt-2">Shipped</p>
          </div>

          <div>
            <CheckCircle className="mx-auto h-5 w-5 text-green-600"/>
            <p className="text-xs mt-2">Delivered</p>
          </div>

        </div>
      </div>

      {/* items */}
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="font-semibold text-lg mb-4">Items</h3>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-zinc-500">
                  Qty: {item.qty}
                </p>
              </div>

              <p className="font-semibold">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* summary */}
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="font-semibold mb-4">Order Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs 25,500</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Rs 500</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Rs 26,000</span>
          </div>
        </div>

        <Link
          href="/shop"
          className="mt-5 inline-block bg-red-600 text-white px-5 py-2 rounded-full"
        >
          Buy again
        </Link>
      </div>

    </div>
  );
}