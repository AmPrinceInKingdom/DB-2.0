import Image from "next/image";
import Link from "next/link";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type OrderSummaryProps = {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString()}`;
}

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  discount,
  total,
}: OrderSummaryProps) {
  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Order summary
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Review before placing order
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-[24px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Link
                href={`/product/${item.id}`}
                className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white dark:bg-zinc-950"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Qty: {item.quantity}
                </p>
                <p className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
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

          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Place order
          </button>

          <Link
            href="/cart"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}