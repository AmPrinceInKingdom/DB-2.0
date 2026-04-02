import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here for guests.
  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Please log in to view your orders
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Your order history will appear here once you sign in.
          </p>
        </div>
      </div>
    );
  }

  // Load the user's orders from newest to oldest.
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = orders ?? [];

  function getOrderStatusClasses(status: string) {
    if (status === "delivered") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (status === "shipped") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    }

    if (status === "processing") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  function getPaymentStatusClasses(status: string) {
    if (status === "paid") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (status === "awaiting_verification") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Order history
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          My Orders
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          View your past and current orders, check payment status, and open full
          order details any time.
        </p>
      </div>

      {/* Empty state */}
      {orderList.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <PackageSearch className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No orders yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            When you place your first order, it will appear here.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orderList.map((order: any) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left side */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                      Order Number
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                      {order.order_number}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Date not available"}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="text-left lg:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                      Total
                    </p>

                    <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
                      Rs. {Number(order.total_amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status badges */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                      String(order.order_status || "")
                    )}`}
                  >
                    Order: {order.order_status || "pending"}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                      String(order.payment_status || "")
                    )}`}
                  >
                    Payment: {order.payment_status || "pending"}
                  </span>

                  {order.coupon_code ? (
                    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      Coupon: {order.coupon_code}
                    </span>
                  ) : null}
                </div>

                {/* Summary details */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Subtotal
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                      Rs. {Number(order.subtotal_amount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Discount
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                      Rs. {Number(order.discount_amount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Shipping
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                      Rs. {Number(order.shipping_amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-5">
                  <Link
                    href={`/orders/${order.order_number}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Bottom helper bar */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                Open the order details page to track shipping, payment progress,
                and order updates.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}