import { createClient } from "@/lib/supabase/server";
import AdminOrderStatusForm from "@/components/admin/AdminOrderStatusForm";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single(),

    supabase
      .from("order_items")
      .select(`
        *,
        products (
          name,
          thumbnail_url
        )
      `)
      .eq("order_id", id),
  ]);

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        Order not found.
      </div>
    );
  }

  const orderItems = items ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold">
          Order #{order.order_number}
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          {new Date(order.created_at).toLocaleString()}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-zinc-500">Order Status</p>
            <p className="font-semibold capitalize">
              {order.order_status}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500">Payment Status</p>
            <p className="font-semibold capitalize">
              {order.payment_status}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500">Payment Method</p>
            <p className="font-semibold capitalize">
              {order.payment_method}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <AdminOrderStatusForm
            orderId={order.id}
            currentStatus={order.order_status}
          />
        </div>
      </div>

      {/* Items */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold">Order Items</h2>

        <div className="mt-4 space-y-4">
          {orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border rounded-2xl p-4 dark:border-zinc-800"
            >
              <img
                src={
                  item.products?.thumbnail_url ||
                  "/images/placeholder-product.jpg"
                }
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">
                  {item.products?.name}
                </p>

                <p className="text-sm text-zinc-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Rs. {Number(item.unit_price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* totals */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold">Totals</h2>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {Number(order.subtotal_amount).toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Rs. {Number(order.shipping_amount).toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>Rs. {Number(order.discount_amount).toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-bold text-base pt-2">
            <span>Total</span>
            <span>Rs. {Number(order.total_amount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Link
        href="/admin/orders"
        className="inline-block text-sm text-red-600"
      >
        ← Back to orders
      </Link>
    </div>
  );
}