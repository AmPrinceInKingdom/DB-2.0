import Link from "next/link";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  ShieldCheck,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Load all dashboard stats in parallel for better performance.
  const [
    { count: totalUsers },
    { count: totalCustomers },
    { count: totalSellers },
    { count: totalProducts },
    { count: activeProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { data: paidOrders },
    { data: orders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "seller"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("order_status", ["pending", "processing"]),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "paid"),
    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        order_status,
        payment_status,
        total_amount,
        created_at,
        profiles (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  // Calculate paid revenue from paid orders only.
  const paidRevenue =
    paidOrders?.reduce((sum: number, order: any) => {
      return sum + Number(order.total_amount || 0);
    }, 0) ?? 0;

  const recentOrders = orders ?? [];

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
      {/* Top dashboard heading */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Platform control
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Overview of platform growth, product activity, orders, payments,
              and user distribution in one clean management dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Manage Orders
            </Link>

            <Link
              href="/admin/products"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Manage Products
            </Link>

            <Link
              href="/admin/users"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* Quick management links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Link
          href="/admin/orders"
          className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Orders
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Review order flow and status updates.
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Boxes className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Products
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Control active listings and inventory.
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Categories
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Organize product browsing structure.
          </p>
        </Link>

        <Link
          href="/admin/coupons"
          className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Coupons
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Manage discounts and promotional codes.
          </p>
        </Link>

        <Link
          href="/admin/payments"
          className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Payments
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Verify payment proofs and status.
          </p>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalUsers ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Customers
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalCustomers ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Sellers
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalSellers ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            <Boxes className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Total Products
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalProducts ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Active Products
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {activeProducts ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Total Orders
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalOrders ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Pending / Processing
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {pendingOrders ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Paid Revenue
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            Rs. {paidRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent orders panel */}
      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Order activity
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Recent Orders
            </h2>
          </div>

          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            View all
          </Link>
        </div>

        {!recentOrders.length ? (
          <div className="mt-5 rounded-[24px] border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No orders yet.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {order.order_number}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {order.profiles?.full_name ||
                        order.profiles?.email ||
                        "Customer"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      Rs. {Number(order.total_amount || 0).toLocaleString()}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                          String(order.order_status || "")
                        )}`}
                      >
                        {order.order_status || "pending"}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                          String(order.payment_status || "")
                        )}`}
                      >
                        {order.payment_status || "pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}