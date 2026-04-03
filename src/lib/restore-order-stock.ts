import { createClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  stock_restored?: boolean | null;
};

type OrderItemRow = {
  product_id: string;
  quantity?: number | null;
};

type ProductRow = {
  stock_quantity?: number | null;
};

export async function restoreOrderStock(orderId: string) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders" as never)
    .select("id, stock_restored")
    .eq("id", orderId)
    .single();

  const orderRow = order as OrderRow | null;

  if (!orderRow || orderRow.stock_restored) {
    return { restored: false };
  }

  const { data: items } = await supabase
    .from("order_items" as never)
    .select("product_id, quantity")
    .eq("order_id", orderId);

  const orderItems = (items as OrderItemRow[] | null) ?? [];

  for (const item of orderItems) {
    const { data: product } = await supabase
      .from("products" as never)
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    const productRow = product as ProductRow | null;

    if (!productRow) continue;

    await supabase
      .from("products" as never)
      .update({
        stock_quantity:
          Number(productRow.stock_quantity || 0) + Number(item.quantity || 0),
      } as never)
      .eq("id", item.product_id);
  }

  await supabase
    .from("orders" as never)
    .update({
      stock_restored: true,
    } as never)
    .eq("id", orderId);

  return { restored: true };
}
