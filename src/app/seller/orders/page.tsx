import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function SellerOrdersPage() {
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here if the user is not logged in.
  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  // Confirm seller access.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Seller access required.
        </div>
      </div>
    );
  }

  // Load all order items with product and parent order details.
  const { data: items } = await supabase
    .from("order_items")
    .select(`
      *,
      products (
        id,
        name,
        thumbnail_url,
        seller_id
      ),
      orders (
        id,
        order_number,
        order_status,
        payment_status,
        created_at,
        total_amount
      )
    `);

  // Keep only the order items that belong to the current seller.
  const list =
    items?.filter((item: any) => item.products?.seller_id === user.id) ?? [];

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
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Seller activity
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Seller Orders
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Review customer purchases related to your products and open full order
          details from your seller area.
        </p>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <PackageSearch className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No orders yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Orders for your products will appear here once customers start
            purchasing from your store.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((item: any) => {
            const lineTotal =
              Number(item.unit_price || 0) * Number(item.quantity || 0);

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="p-5 md:p-6">
                  <div className="grid gap-6 xl:grid-cols-[1fr_220px]">
                    {/* Left side */}
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <img
                        src={
                          item.products?.thumbnail_url ||
                          "/images/placeholder-product.jpg"
                        }
                        className="h-24 w-24 rounded-[20px] object-cover"
                        alt={item.products?.name || "Product"}
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                          {item.products?.name || "Unnamed product"}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                          Order #{item.orders?.order_number || "-"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Ordered at:{" "}
                          {item.orders?.created_at
                            ? new Date(item.orders.created_at).toLocaleString()
                            : "Date not available"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                              String(item.orders?.order_status || "")
                            )}`}
                          >
                            {item.orders?.order_status || "pending"}
                          </span>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                              String(item.orders?.payment_status || "")
                            )}`}
                          >
                            {item.orders?.payment_status || "pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col gap-3 xl:items-end xl:text-right">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          Unit Price
                        </p>
                        <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                          Rs. {Number(item.unit_price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          Line Total
                        </p>
                        <p className="mt-2 text-lg font-black text-zinc-900 dark:text-white">
                          Rs. {lineTotal.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/seller/orders/${item.orders?.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom helper bar */}
                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                  This entry shows how one of your products appears inside a
                  customer order.
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}