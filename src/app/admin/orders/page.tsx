import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminOrderStatusForm from "@/components/admin/AdminOrderStatusForm";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
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
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Admin access required.
        </div>
      </div>
    );
  }

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (search.trim()) {
    query = query.ilike("order_number", `%${search.trim()}%`);
  }

  const { data: orders } = await query;
  const orderList = orders ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Admin Orders
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage order statuses and review customer purchases.
          </p>
        </div>

        <form className="flex gap-3" action="/admin/orders">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by order number"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white sm:w-72"
          />
          <button
            type="submit"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Search
          </button>
        </form>
      </div>

      {orderList.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          No orders found.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orderList.map((order: any) => (
            <div
              key={order.id}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Order Number
                    </p>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {order.order_number}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      Order: {order.order_status}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      Payment: {order.payment_status}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      Method: {order.payment_method}
                    </span>
                  </div>

                  <p className="text-base font-bold text-zinc-900 dark:text-white">
                    Rs. {Number(order.total_amount || 0).toLocaleString()}
                  </p>

                  <Link
                    href={`/orders/${order.order_number}`}
                    className="inline-block text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    View Customer Order Page
                  </Link>
                </div>

                <div className="lg:min-w-[320px]">
                  <AdminOrderStatusForm
                    orderId={order.id}
                    currentStatus={order.order_status}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}