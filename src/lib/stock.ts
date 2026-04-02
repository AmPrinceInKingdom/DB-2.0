import { createClient } from "@/lib/supabase/server";

export async function checkProductStock(
  productId: string,
  quantity: number
) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("stock_quantity, status")
    .eq("id", productId)
    .single();

  if (error || !product) {
    return {
      ok: false,
      error: "Product not found",
    };
  }

  if (product.status !== "active") {
    return {
      ok: false,
      error: "Product not available",
    };
  }

  if (product.stock_quantity < quantity) {
    return {
      ok: false,
      error: "Not enough stock available",
    };
  }

  return { ok: true };
}

export async function reduceProductStock(
  productId: string,
  quantity: number
) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", productId)
    .single();

  if (!product) return;

  const newStock = Math.max(product.stock_quantity - quantity, 0);

  await supabase
    .from("products")
    .update({
      stock_quantity: newStock,
    })
    .eq("id", productId);
}