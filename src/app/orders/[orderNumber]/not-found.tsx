import Link from "next/link";

export default function OrderNotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
          📦
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-zinc-900">
          Order not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          We could not find the order you are looking for. It may have been
          removed, or the order number may be incorrect.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-full bg-red-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Back to My Orders
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}