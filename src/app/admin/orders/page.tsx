import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminOrderStatusForm from "@/components/admin/AdminOrderStatusForm";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

type AdminProfile = {
  role?: string | null;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  created_at: string | null;
  total_amount: number | null;
  order_status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  subtotal_amount: number | null;
  discount_amount: number | null;
  shipping_amount: number | null;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { search = "" } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles" as never)
    .select("role")
    .eq("id", user.id)
    .single();

  const profileRow = profile as AdminProfile | null;

  if (!profileRow || profileRow.role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Admin access required.
        </div>
      </div>
    );
  }

  let query = supabase
    .from("orders" as never)
    .select("*")
    .order("created_at", { ascending: false });

  if (search.trim()) {
    query = query.ilike("order_number", `%${search.trim()}%`);
  }

  const { data: orders } = await query;
  const orderList = (orders as OrderRow[] | null) ?? [];

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
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Order management
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Admin Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Manage order statuses, review payment states, and inspect customer
              purchases from one organized admin page.
            </p>
          </div>

          <form className="flex gap-3" action="/admin/orders">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by order number"
                className="h-11 w-full rounded-full border border-zinc-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {orderList.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <ClipboardList className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No orders found
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Try a different search or wait for new customer orders to appear.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          Order Number
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                          {order.order_number || "-"}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString()
                            : "Date not available"}
                        </p>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          Final Total
                        </p>

                        <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
                          Rs. {Number(order.total_amount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                          String(order.order_status || ""),
                        )}`}
                      >
                        Order: {order.order_status || "pending"}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                          String(order.payment_status || ""),
                        )}`}
                      >
                        Payment: {order.payment_status || "pending"}
                      </span>

                      <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold capitalize text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        Method: {order.payment_method || "-"}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
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

                    <div>
                      <Link
                        href={`/orders/${order.order_number}`}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        View Customer Order Page
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Update Order Status
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Change the order flow from admin control.
                    </p>

                    <div className="mt-4">
                      <AdminOrderStatusForm
                        orderId={order.id}
                        currentStatus={order.order_status || "pending"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                Use this page to manage processing, shipping, delivery, and
                payment-related order flow.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}