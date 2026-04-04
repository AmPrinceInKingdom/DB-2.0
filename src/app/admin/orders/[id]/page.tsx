import { createClient } from "@/lib/supabase/server";
import AdminOrderStatusForm from "@/components/admin/AdminOrderStatusForm";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  created_at: string | null;
  order_status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  subtotal_amount: number | null;
  shipping_amount: number | null;
  discount_amount: number | null;
  total_amount: number | null;
};

type OrderItemRow = {
  id: string;
  quantity: number | null;
  unit_price: number | null;
  products?: {
    name?: string | null;
    thumbnail_url?: string | null;
  } | null;
};

export default async function AdminOrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase
      .from("orders" as never)
      .select("*")
      .eq("id", id)
      .single(),

    supabase
      .from("order_items" as never)
      .select(`
        *,
        products (
          name,
          thumbnail_url
        )
      `)
      .eq("order_id", id),
  ]);

  const orderRow = order as OrderRow | null;
  const orderItems = (items as OrderItemRow[] | null) ?? [];

  if (!orderRow) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Order not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold">Order #{orderRow.order_number}</h1>

        <p className="mt-1 text-sm text-zinc-500">
          {orderRow.created_at
            ? new Date(orderRow.created_at).toLocaleString()
            : "Date not available"}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-zinc-500">Order Status</p>
            <p className="font-semibold capitalize">
              {orderRow.order_status || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500">Payment Status</p>
            <p className="font-semibold capitalize">
              {orderRow.payment_status || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500">Payment Method</p>
            <p className="font-semibold capitalize">
              {orderRow.payment_method || "-"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <AdminOrderStatusForm
            orderId={orderRow.id}
            currentStatus={orderRow.order_status || "pending"}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold">Order Items</h2>

        <div className="mt-4 space-y-4">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border p-4 dark:border-zinc-800"
            >
              <img
                src={
                  item.products?.thumbnail_url ||
                  "/images/placeholder-product.jpg"
                }
                alt={item.products?.name || "Product"}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.products?.name || "-"}</p>

                <p className="text-sm text-zinc-500">
                  Qty: {item.quantity ?? 0}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Rs. {Number(item.unit_price || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold">Totals</h2>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              Rs. {Number(orderRow.subtotal_amount || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              Rs. {Number(orderRow.shipping_amount || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>
              Rs. {Number(orderRow.discount_amount || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between pt-2 text-base font-bold">
            <span>Total</span>
            <span>
              Rs. {Number(orderRow.total_amount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <Link href="/admin/orders" className="inline-block text-sm text-red-600">
        ← Back to orders
      </Link>
    </div>
  );
}