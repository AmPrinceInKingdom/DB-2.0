import { createClient } from "@/lib/supabase/server";
import UploadPaymentProofForm from "@/components/orders/UploadPaymentProofForm";
import CancelOrderButton from "@/components/orders/CancelOrderButton";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { orderNumber } = await params;
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here for guests.
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in to view order details.
        </div>
      </div>
    );
  }

  // Load the selected order for the current user only.
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("order_number", orderNumber)
    .single();

  // Show a clean empty state if the order does not exist.
  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Order not found.
        </div>
      </div>
    );
  }

  // Load order items and uploaded payment proofs together.
  const [{ data: items }, { data: paymentProofs }] = await Promise.all([
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("payment_proofs")
      .select("*")
      .eq("order_id", order.id)
      .order("uploaded_at", { ascending: false }),
  ]);

  const orderItems = items ?? [];
  const proofs = paymentProofs ?? [];

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
      {/* Top page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Order details
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          {order.order_number}
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Review your order summary, payment state, uploaded proof, shipping
          progress, and ordered products in one place.
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left side */}
        <div className="space-y-6">
          {/* Overview cards */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Order Status
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                      String(order.order_status || "")
                    )}`}
                  >
                    {order.order_status || "pending"}
                  </span>
                </div>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Payment Status
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                      String(order.payment_status || "")
                    )}`}
                  >
                    {order.payment_status || "pending"}
                  </span>
                </div>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Payment Method
                </p>
                <p className="mt-2 text-sm font-semibold capitalize text-zinc-900 dark:text-white">
                  {order.payment_method}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Total
                </p>
                <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                  Rs. {Number(order.total_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
          </div>

          {/* Cancel state block */}
          {order.order_status === "cancelled" ? (
            <div className="rounded-[30px] border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/40 dark:bg-red-950/20 md:p-6">
              <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
                This order has been cancelled
              </h2>

              <div className="mt-4 space-y-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  Cancelled at:{" "}
                  {order.cancelled_at
                    ? new Date(order.cancelled_at).toLocaleString()
                    : "-"}
                </p>
                <p>Reason: {order.cancel_reason || "-"}</p>
              </div>
            </div>
          ) : null}

          {/* Shipping info */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Shipping
            </p>

            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Shipping Info
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Courier
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {order.courier_name || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Tracking Number
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {order.tracking_number || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Shipped At
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {order.shipped_at
                    ? new Date(order.shipped_at).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Delivered At
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {order.delivered_at
                    ? new Date(order.delivered_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Bank transfer proof section */}
          {order.payment_method === "bank_transfer" ? (
            <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Bank Transfer Proof
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Upload your payment slip after completing the bank transfer.
              </p>

              <div className="mt-5 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 dark:border-zinc-800 dark:bg-zinc-900">
                <p>
                  <span className="font-semibold">Bank:</span> Commercial Bank
                </p>
                <p>
                  <span className="font-semibold">Account Name:</span> Deal Bazaar
                </p>
                <p>
                  <span className="font-semibold">Account Number:</span> 1234567890
                </p>
                <p>
                  <span className="font-semibold">Branch:</span> Tangalle
                </p>
              </div>

              <div className="mt-5">
                <UploadPaymentProofForm orderId={order.id} />
              </div>

              {proofs.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {proofs.map((proof: any) => (
                    <div
                      key={proof.id}
                      className="rounded-[24px] border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <p className="text-sm font-semibold capitalize text-zinc-900 dark:text-white">
                        Status: {proof.verification_status}
                      </p>

                      {proof.note ? (
                        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                          {proof.note}
                        </p>
                      ) : null}

                      <a
                        href={proof.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        View uploaded slip
                      </a>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Ordered items */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Purchased items
            </p>

            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Order Items
            </h2>

            <div className="mt-5 space-y-4">
              {orderItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <img
                    src={item.product_image_url || "/images/placeholder-product.jpg"}
                    alt={item.product_name}
                    className="h-20 w-20 rounded-[18px] object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white sm:text-base">
                      {item.product_name}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                      Rs. {Number(item.unit_price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Action panel */}
          {["pending", "processing"].includes(order.order_status || "") ? (
            <CancelOrderButton orderId={order.id} />
          ) : null}

          {/* Order helper panel */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Order Number</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {order.order_number}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Coupon</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {order.coupon_code || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Stock Restored</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {order.stock_restored ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                <span>Final Total</span>
                <span>Rs. {Number(order.total_amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Helper note */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Need help?
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              Use the notifications page and your order list to keep track of
              payment progress, shipping updates, and delivery status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}