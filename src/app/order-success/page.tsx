import Link from "next/link";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl dark:bg-green-950">
          ✅
        </div>

        <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
          Order placed successfully
        </h1>

        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Thank you for shopping with Deal Bazaar.
        </p>

        {order ? (
          <p className="mt-4 text-sm font-semibold text-red-600">
            Order Number: {order}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            View Orders
          </Link>

          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}