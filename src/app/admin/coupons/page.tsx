import { TicketPercent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AddCouponForm from "@/components/admin/AddCouponForm";

export default async function AdminCouponsPage() {
  const supabase = await createClient();

  // Load coupons from newest to oldest.
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  const list = coupons ?? [];

  function getCouponTypeLabel(type: string) {
    if (type === "percentage") {
      return "Percentage";
    }

    if (type === "fixed") {
      return "Fixed Amount";
    }

    return type || "Unknown";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Discount control
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Coupons
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Create and manage promotional codes, usage limits, and discount
          values across the marketplace.
        </p>
      </div>

      {/* Add coupon form */}
      <div className="mt-6">
        <AddCouponForm />
      </div>

      {/* Coupon list */}
      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Coupon list
          </p>
          <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
            Active and saved coupons
          </h2>
        </div>

        {!list.length ? (
          <div className="mt-5 rounded-[24px] border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
              <TicketPercent className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
              No coupons yet
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Create your first coupon above to start offering discounts.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {list.map((coupon: any) => {
              const usedCount = Number(coupon.used_count || 0);
              const usageLimit = coupon.usage_limit ?? null;
              const remaining =
                usageLimit === null ? null : Math.max(usageLimit - usedCount, 0);

              return (
                <div
                  key={coupon.id}
                  className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="p-5">
                    <div className="grid gap-5 xl:grid-cols-[1fr_220px]">
                      {/* Left side */}
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-bold uppercase tracking-wide text-zinc-900 dark:text-white">
                            {coupon.code}
                          </p>

                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                            {getCouponTypeLabel(coupon.discount_type)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-[20px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Discount
                            </p>
                            <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                              {coupon.discount_value}
                            </p>
                          </div>

                          <div className="rounded-[20px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Used
                            </p>
                            <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                              {usedCount}
                            </p>
                          </div>

                          <div className="rounded-[20px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Usage Limit
                            </p>
                            <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                              {usageLimit ?? "Unlimited"}
                            </p>
                          </div>

                          <div className="rounded-[20px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Remaining
                            </p>
                            <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                              {remaining === null ? "Unlimited" : remaining}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-col justify-center rounded-[24px] border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          Coupon Summary
                        </p>

                        <div className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <p>Type: {getCouponTypeLabel(coupon.discount_type)}</p>
                          <p>Used: {usedCount}</p>
                          <p>
                            Limit: {usageLimit === null ? "Unlimited" : usageLimit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom helper bar */}
                  <div className="border-t border-zinc-200 bg-white px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    Use coupons to run promotions, increase conversions, and
                    control discount campaigns more easily.
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}