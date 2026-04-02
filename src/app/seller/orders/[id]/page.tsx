import { createClient } from "@/lib/supabase/server";
import UpdateSellerOrderStatus from "@/components/seller/UpdateSellerOrderStatus";
import ShippingUpdateForm from "@/components/orders/ShippingUpdateForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SellerOrderDetails({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Load the authenticated seller.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please login
        </div>
      </div>
    );
  }

  // Load the order items with product and order information.
  const { data: items } = await supabase
    .from("order_items")
    .select(`
      *,
      products (
        name,
        thumbnail_url,
        seller_id
      ),
      orders (
        id,
        order_number,
        order_status,
        payment_status,
        shipping_full_name,
        shipping_address_line_1,
        shipping_city,
        courier_name,
        tracking_number,
        shipped_at,
        delivered_at,
        created_at,
        total_amount
      )
    `)
    .eq("order_id", id);

  // Keep only items that belong to the logged-in seller.
  const sellerItems =
    items?.filter((i: any) => i.products?.seller_id === user.id) ?? [];

  if (!sellerItems.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          No access
        </div>
      </div>
    );
  }

  const order = sellerItems[0].orders;

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
          Seller order details
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Order #{order.order_number}
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Review the customer shipping details, update the order status, and
          manage delivery progress for your items.
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left side */}
        <div className="space-y-6">
          {/* Overview panel */}
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
                  Ordered At
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Order Total
                </p>
                <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                  Rs. {Number(order.total_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer address */}
            <div className="mt-5 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Customer Shipping Address
              </p>

              <div className="mt-3 space-y-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <p>Customer: {order.shipping_full_name || "-"}</p>
                <p>Address: {order.shipping_address_line_1 || "-"}</p>
                <p>City: {order.shipping_city || "-"}</p>
              </div>
            </div>
          </div>

          {/* Seller items */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Seller items
            </p>

            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Products in this Order
            </h2>

            <div className="mt-5 space-y-4">
              {sellerItems.map((item: any) => {
                const lineTotal =
                  Number(item.unit_price || 0) * Number(item.quantity || 0);

                return (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.products?.thumbnail_url ||
                            "/images/placeholder-product.jpg"
                          }
                          className="h-20 w-20 rounded-[18px] object-cover"
                          alt={item.products?.name || "Product"}
                        />

                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {item.products?.name}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Qty: {item.quantity}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Unit Price: Rs.{" "}
                            {Number(item.unit_price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Line Total
                        </p>
                        <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                          Rs. {lineTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current shipping info */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Current Shipping Info
            </h3>

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
                  Tracking
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
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Status update */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Update Order Status
            </p>

            <div className="mt-4">
              <UpdateSellerOrderStatus
                orderId={order.id}
                status={order.order_status}
              />
            </div>
          </div>

          {/* Shipping update form */}
          <ShippingUpdateForm
            orderId={order.id}
            initialCourierName={order.courier_name}
            initialTrackingNumber={order.tracking_number}
            initialOrderStatus={order.order_status}
          />

          {/* Helper card */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Seller Note
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              Use this page to update shipping details and keep the order status
              accurate for the customer. Shipping updates here will help the
              customer track progress more clearly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}