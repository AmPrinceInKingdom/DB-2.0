"use client";

import { useState, useTransition } from "react";
import { applyCouponAction } from "@/app/actions/coupon-actions";
import FormMessage from "@/components/shared/FormMessage";

export default function CouponBox({
  subtotal,
  shippingAmount,
  freeShippingThreshold,
}: {
  subtotal: number;
  shippingAmount: number;
  freeShippingThreshold: number;
}) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [couponId, setCouponId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  const finalTotal = Math.max(subtotal - discount + shippingAmount, 0);

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
        Coupon
      </h3>

      <div className="flex gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const fd = new FormData();
            fd.set("code", code);
            fd.set("subtotal", String(subtotal));

            startTransition(async () => {
              const result = await applyCouponAction(fd);

              if (result?.error) {
                setMessageType("error");
                setMessage(result.error);
                setDiscount(0);
                setAppliedCode("");
                setCouponId("");
                return;
              }

              setMessageType("success");
              setMessage(result?.success || "Coupon applied.");
              setDiscount(Number(result?.coupon?.discountAmount || 0));
              setAppliedCode(String(result?.coupon?.code || ""));
              setCouponId(String(result?.coupon?.id || ""));
            });
          }}
          className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply"}
        </button>
      </div>

      <input type="hidden" name="coupon_id" value={couponId} />
      <input type="hidden" name="coupon_code" value={appliedCode} />
      <input type="hidden" name="discount_amount" value={discount} />
      <input type="hidden" name="subtotal_amount" value={subtotal} />
      <input type="hidden" name="shipping_amount" value={shippingAmount} />
      <input type="hidden" name="final_total" value={finalTotal} />

      {message ? <FormMessage type={messageType} message={message} /> : null}

      {freeShippingThreshold > 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Free shipping for orders above Rs.{" "}
          {freeShippingThreshold.toLocaleString()}
        </p>
      ) : null}

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Coupon</span>
          <span>{appliedCode || "-"}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Discount</span>
          <span>- Rs. {discount.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Shipping</span>
          <span>
            {shippingAmount <= 0 ? "Free" : `Rs. ${shippingAmount.toLocaleString()}`}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
          <span>Final Total</span>
          <span>Rs. {finalTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}