import Link from "next/link";
import { BadgePercent, CreditCard, ShieldCheck, Truck } from "lucide-react";

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
};

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString()}`;
}

export default function CartSummary({
  subtotal,
  shipping,
  discount,
  total,
  itemCount,
}: CartSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Order summary
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Simple checkout overview
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {itemCount} item{itemCount > 1 ? "s" : ""} selected in your cart.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Shipping</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {shipping === 0 ? "Free" : formatCurrency(shipping)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Discount</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              - {formatCurrency(discount)}
            </span>
          </div>

          <div className="rounded-2xl bg-zinc-50 px-4 py-4 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Total
              </span>
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <BadgePercent className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Promo applied
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Clean checkout offer has already been added to your order.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Proceed to checkout
          </Link>

          <Link
            href="/shop"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Continue shopping
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Delivery support
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Orders over Rs 50,000 get free shipping.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Clean payment flow
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Checkout is designed to feel simple and comfortable.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Safer shopping feel
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Simple spacing and clear pricing reduce confusion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}