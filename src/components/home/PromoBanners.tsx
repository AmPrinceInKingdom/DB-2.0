import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="bg-gradient-to-br from-white via-red-50 to-zinc-100 px-5 py-8 dark:from-zinc-950 dark:via-red-950/20 dark:to-zinc-900 sm:px-7 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Limited offer
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Save more on trending picks
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Explore selected products with cleaner pricing blocks, better spacing, and a friendlier shopping flow.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Shop now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/compare"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Compare products
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-900 shadow-sm dark:border-zinc-800">
          <div className="bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.28),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_30%)] px-5 py-8 text-white sm:px-7 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
              Clean shopping
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Built for comfort on every screen
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-300">
              Mobile-first spacing, simple product browsing, and an easy-to-use layout for customers and sellers alike.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-lg font-bold">Clean</p>
                <p className="mt-1 text-xs text-zinc-300">Less clutter, better focus</p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-lg font-bold">Simple</p>
                <p className="mt-1 text-xs text-zinc-300">Friendly product flow</p>
              </div>
            </div>

            <Link
              href="/account"
              className="mt-6 inline-flex items-center text-sm font-semibold text-white transition hover:text-red-300"
            >
              Go to account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}