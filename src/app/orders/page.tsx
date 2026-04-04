import Link from "next/link";
import {
  CreditCard,
  Landmark,
  PackageSearch,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  order_number?: string | null;
  created_at?: string | null;
  total_amount?: number | null;
  subtotal_amount?: number | null;
  discount_amount?: number | null;
  shipping_amount?: number | null;
  order_status?: string | null;
  payment_status?: string | null;
  payment_method?: string | null;
  coupon_code?: string | null;
};

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            Please log in to view your orders
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your order history will appear here once you sign in.
          </p>
        </div>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = (orders ?? []) as OrderRow[];

  function getOrderStatusClasses(status: string) {
    if (status === "delivered") {
      return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    }

    if (status === "shipped") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    }

    if (status === "processing") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  function getPaymentStatusClasses(status: string) {
    if (status === "paid") {
      return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    }

    if (status === "awaiting_verification") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  function getPaymentMethodLabel(method?: string | null) {
    if (method === "bank_transfer") return "Bank Transfer";
    if (method === "card") return "Card Payment";
    if (method === "cod") return "Cash on Delivery";
    return "Not selected";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Order history
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            View your past and current orders, check payment status, and open
            full order details any time.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {orderList.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <PackageSearch className="h-6 w-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            No orders yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            When you place your first order, it will appear here.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left side */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Order Number
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-foreground">
                      {order.order_number}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Date not available"}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="text-left lg:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Total
                    </p>

                    <p className="mt-2 text-2xl font-black text-foreground">
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

                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Method: {getPaymentMethodLabel(order.payment_method)}
                  </span>

                  {order.coupon_code ? (
                    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      Coupon: {order.coupon_code}
                    </span>
                  ) : null}
                </div>

                {/* Summary details */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Subtotal
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Rs. {Number(order.subtotal_amount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Discount
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Rs. {Number(order.discount_amount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Shipping
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Rs. {Number(order.shipping_amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Payment helper */}
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-foreground">
                      Bank Transfer
                    </p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Available for manual payment confirmation.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-foreground">
                      Card Payment
                    </p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Supported in the current checkout flow.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-dashed border-border bg-muted/20 p-4 opacity-80">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Truck className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-foreground">
                      Cash on Delivery
                    </p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Coming soon
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/orders/${order.order_number}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Bottom helper bar */}
              <div className="border-t border-border/70 bg-muted/20 px-5 py-3 text-xs text-muted-foreground md:px-6">
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