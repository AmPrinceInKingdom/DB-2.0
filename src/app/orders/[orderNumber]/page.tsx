import { createClient } from "@/lib/supabase/server";
import UploadPaymentProofForm from "@/components/orders/UploadPaymentProofForm";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import {
  CreditCard,
  Landmark,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

type OrderRow = {
  id: string;
  order_number?: string | null;
  order_status?: string | null;
  payment_status?: string | null;
  payment_method?: string | null;
  total_amount?: number | null;
  subtotal_amount?: number | null;
  discount_amount?: number | null;
  shipping_amount?: number | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  courier_name?: string | null;
  tracking_number?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  coupon_code?: string | null;
  stock_restored?: boolean | null;
};

type OrderItemRow = {
  id: string;
  product_image_url?: string | null;
  product_name?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
};

type PaymentProofRow = {
  id: string;
  verification_status?: string | null;
  note?: string | null;
  image_url?: string | null;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { orderNumber } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center text-muted-foreground shadow-sm">
          Please log in to view order details.
        </div>
      </div>
    );
  }

  const { data: order } = await supabase
    .from("orders" as never)
    .select("*")
    .eq("user_id", user.id)
    .eq("order_number", orderNumber)
    .single();

  const orderRow = order as OrderRow | null;

  if (!orderRow) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center text-muted-foreground shadow-sm">
          Order not found.
        </div>
      </div>
    );
  }

  const [{ data: items }, { data: paymentProofs }] = await Promise.all([
    supabase
      .from("order_items" as never)
      .select("*")
      .eq("order_id", orderRow.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("payment_proofs" as never)
      .select("*")
      .eq("order_id", orderRow.id)
      .order("uploaded_at", { ascending: false }),
  ]);

  const orderItems = (items as OrderItemRow[] | null) ?? [];
  const proofs = (paymentProofs as PaymentProofRow[] | null) ?? [];

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
    return "-";
  }

  function getProofStatusClasses(status: string) {
    if (status === "approved") {
      return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    }

    if (status === "awaiting_verification" || status === "pending") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Order details
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
            {orderRow.order_number || "-"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Review your order summary, payment state, uploaded proof, shipping
            progress, and ordered products in one place.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Overview */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <h2 className="text-xl font-bold text-foreground">
                Order Overview
              </h2>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Order Status
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                        String(orderRow.order_status || "")
                      )}`}
                    >
                      {orderRow.order_status || "pending"}
                    </span>
                  </div>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment Status
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                        String(orderRow.payment_status || "")
                      )}`}
                    >
                      {orderRow.payment_status || "pending"}
                    </span>
                  </div>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {getPaymentMethodLabel(orderRow.payment_method)}
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Total
                  </p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    Rs. {Number(orderRow.total_amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Subtotal
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Rs. {Number(orderRow.subtotal_amount || 0).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Discount
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Rs. {Number(orderRow.discount_amount || 0).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Shipping
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Rs. {Number(orderRow.shipping_amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation block */}
          {orderRow.order_status === "cancelled" ? (
            <div className="rounded-[30px] border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/40 dark:bg-red-950/20 md:p-6">
              <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
                This order has been cancelled
              </h2>

              <div className="mt-4 space-y-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  Cancelled at:{" "}
                  {orderRow.cancelled_at
                    ? new Date(orderRow.cancelled_at).toLocaleString()
                    : "-"}
                </p>
                <p>Reason: {orderRow.cancel_reason || "-"}</p>
              </div>
            </div>
          ) : null}

          {/* Shipping */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Shipping
              </p>

              <h2 className="mt-2 text-xl font-bold text-foreground">
                Shipping Info
              </h2>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Courier
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {orderRow.courier_name || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tracking Number
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {orderRow.tracking_number || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Shipped At
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {orderRow.shipped_at
                    ? new Date(orderRow.shipped_at).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Delivered At
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {orderRow.delivered_at
                    ? new Date(orderRow.delivered_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment methods info */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Payment
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Payment Options
              </h2>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Landmark className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">
                  Bank Transfer
                </p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Available now for manual payment confirmation.
                </p>
              </div>

              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">
                  Card Payment
                </p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Available now in the checkout flow.
                </p>
              </div>

              <div className="rounded-[24px] border border-dashed border-border bg-muted/20 p-4 opacity-80">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Truck className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">
                  Cash on Delivery
                </p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Bank transfer proof */}
          {orderRow.payment_method === "bank_transfer" ? (
            <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
              <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
                <h2 className="text-xl font-bold text-foreground">
                  Bank Transfer Proof
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Upload your payment slip after completing the bank transfer.
                </p>
              </div>

              <div className="p-5 md:p-6">
                <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4 text-sm leading-7">
                  <p className="text-foreground">
                    <span className="font-semibold">Bank:</span> Commercial Bank
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">Account Name:</span> Deal Bazaar
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">Account Number:</span> 1234567890
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">Branch:</span> Tangalle
                  </p>
                </div>

                <div className="mt-5">
                  <UploadPaymentProofForm orderId={orderRow.id} />
                </div>

                {proofs.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {proofs.map((proof) => (
                      <div
                        key={proof.id}
                        className="rounded-[24px] border border-border/70 bg-background p-4"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getProofStatusClasses(
                              String(proof.verification_status || "pending")
                            )}`}
                          >
                            {proof.verification_status || "pending"}
                          </span>
                        </div>

                        {proof.note ? (
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {proof.note}
                          </p>
                        ) : null}

                        <a
                          href={proof.image_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                        >
                          View uploaded slip
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Order items */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Purchased items
              </p>

              <h2 className="mt-2 text-xl font-bold text-foreground">
                Order Items
              </h2>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-[24px] border border-border/70 bg-muted/20 p-4"
                >
                  <img
                    src={item.product_image_url || "/images/placeholder-product.jpg"}
                    alt={item.product_name || "Product"}
                    className="h-20 w-20 rounded-[18px] object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-foreground sm:text-base">
                      {item.product_name || "Unnamed product"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Quantity: {item.quantity || 0}
                    </p>
                    <p className="mt-2 text-sm font-bold text-foreground">
                      Rs. {Number(item.unit_price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {["pending", "processing"].includes(orderRow.order_status || "") ? (
            <CancelOrderButton orderId={orderRow.id} />
          ) : null}

          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <h2 className="text-lg font-bold text-foreground">
                Order Summary
              </h2>
            </div>

            <div className="p-5 md:p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Order Number</span>
                  <span className="font-semibold text-foreground">
                    {orderRow.order_number || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Coupon</span>
                  <span className="font-semibold text-foreground">
                    {orderRow.coupon_code || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Stock Restored</span>
                  <span className="font-semibold text-foreground">
                    {orderRow.stock_restored ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                  <span>Final Total</span>
                  <span>
                    Rs. {Number(orderRow.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-dashed border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <PackageCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Order flow
                    </p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Orders currently support bank transfer and card payment.
                      Cash on delivery is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="p-5 md:p-6">
              <h2 className="text-lg font-bold text-foreground">
                Need help?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Use the notifications page and your order list to keep track of
                payment progress, shipping updates, and delivery status.
              </p>

              <div className="mt-4 rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-xs leading-6 text-muted-foreground">
                    Upload bank transfer proof only if your selected payment
                    method is bank transfer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}