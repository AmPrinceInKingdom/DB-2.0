"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrderAction } from "@/app/actions/checkout-actions";

type PlaceOrderButtonProps = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  paymentMethod: "cod" | "bank_transfer" | "card";
  customerNote?: string;
  shippingFee?: number;
  discountAmount?: number;
};

export default function PlaceOrderButton(props: PlaceOrderButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePlaceOrder = () => {
    setMessage("");

    startTransition(async () => {
      const result = await placeOrderAction(props);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      if (result.orderNumber) {
        router.push(`/order-success?order=${result.orderNumber}`);
        return;
      }

      setMessage(result.success || "Order placed.");
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Placing order..." : "Place order"}
      </button>

      {message ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      ) : null}
    </div>
  );
}