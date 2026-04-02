import { createClient } from "@/lib/supabase/server";

export async function restoreOrderStock(orderId: string) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, stock_restored")
    .eq("id", orderId)
    .single();

  if (!order || order.stock_restored) {
    return { restored: false };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  for (const item of items ?? []) {
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (!product) continue;

    await supabase
      .from("products")
      .update({
        stock_quantity: Number(product.stock_quantity || 0) + Number(item.quantity || 0),
      })
      .eq("id", item.product_id);
  }

  await supabase
    .from("orders")
    .update({
      stock_restored: true,
    })
    .eq("id", orderId);

  return { restored: true };
}