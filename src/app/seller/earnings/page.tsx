import { createClient } from "@/lib/supabase/server";

export default async function SellerEarningsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        Please log in first.
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        Seller access required.
      </div>
    );
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      price,
      products (
        seller_id
      ),
      orders (
        id,
        status,
        created_at
      )
    `);

  const sellerItems =
    items?.filter((item: any) => item.products?.seller_id === user.id) ?? [];

  const totalOrders = new Set(
    sellerItems.map((item: any) => item.orders?.id).filter(Boolean)
  ).size;

  const totalSales = sellerItems.reduce((sum: number, item: any) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const deliveredRevenue = sellerItems
    .filter((item: any) => item.orders?.status === "delivered")
    .reduce((sum: number, item: any) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);

  const pendingCount = new Set(
    sellerItems
      .filter((item: any) =>
        ["pending", "processing"].includes(item.orders?.status)
      )
      .map((item: any) => item.orders?.id)
      .filter(Boolean)
  ).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Seller Earnings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Overview of your sales and earnings.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Orders
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Sales Value
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Rs. {totalSales.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Delivered Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Rs. {deliveredRevenue.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pending / Processing
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
              {pendingCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}