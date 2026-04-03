import Link from "next/link";
import { BarChart3, Package, Plus, ShoppingBag, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function SellerDashboardPage() {
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here if the user is not logged in.
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  // Load profile and confirm seller access.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Seller access required.
        </div>
      </div>
    );
  }

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: draftProducts },
    { data: sellerOrderItems },
    { data: recentProducts },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", user.id),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", user.id)
      .eq("status", "active"),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", user.id)
      .eq("status", "draft"),

    supabase
      .from("order_items")
      .select(`
        id,
        quantity,
        unit_price,
        products (
          seller_id
        ),
        orders (
          id,
          order_status
        )
      `),

    supabase
      .from("products")
      .select("id, name, slug, status, price, thumbnail_url, created_at")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Filter order items to include only the seller's own products.
  const sellerItems =
    sellerOrderItems?.filter(
      (item: any) => item.products?.seller_id === user.id
    ) ?? [];

  // Count unique orders related to this seller.
  const totalOrders = new Set(
    sellerItems.map((item: any) => item.orders?.id).filter(Boolean)
  ).size;

  // Count pending and processing orders.
  const pendingOrders = new Set(
    sellerItems
      .filter((item: any) =>
        ["pending", "processing"].includes(item.orders?.order_status)
      )
      .map((item: any) => item.orders?.id)
      .filter(Boolean)
  ).size;

  // Revenue is calculated from delivered items only.
  const deliveredRevenue = sellerItems
    .filter((item: any) => item.orders?.order_status === "delivered")
    .reduce((sum: number, item: any) => {
      return sum + Number(item.unit_price || 0) * Number(item.quantity || 0);
    }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Top welcome panel */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Seller center
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Seller Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Welcome back, {profile.full_name || profile.email || "Seller"}.
              Manage your products, track orders, and monitor revenue from one
              clean dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/seller/products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>My Products</span>
            </Link>

            <Link
              href="/seller/products/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>

            <Link
              href="/seller/orders"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Orders
            </Link>

            <Link
              href="/seller/earnings"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Earnings
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Package className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Total Products
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalProducts ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
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
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Draft Products
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {draftProducts ?? 0}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Total Orders
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Package className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Pending / Processing
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Delivered Revenue
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
            Rs. {deliveredRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent products panel */}
      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Product overview
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Recent Products
            </h2>
          </div>

          <Link
            href="/seller/products"
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            View all
          </Link>
        </div>

        {!recentProducts?.length ? (
          <div className="mt-5 rounded-[24px] border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No products yet.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {recentProducts.map((product: any) => (
              <div
                key={product.id}
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.thumbnail_url ||
                        "/images/placeholder-product.jpg"
                      }
                      alt={product.name}
                      className="h-16 w-16 rounded-[18px] object-cover"
                    />

                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {product.status} • Rs.{" "}
                        {Number(product.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}