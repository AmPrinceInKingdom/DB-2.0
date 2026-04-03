import { createClient } from "@/lib/supabase/server";

type ProductStockRow = {
  stock_quantity?: number | null;
  status?: string | null;
};

export async function checkProductStock(
  productId: string,
  quantity: number
) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products" as never)
    .select("stock_quantity, status")
    .eq("id", productId)
    .single();

  const productRow = product as ProductStockRow | null;

  if (error || !productRow) {
    return {
      ok: false,
      error: "Product not found",
    };
  }

  if (productRow.status !== "active") {
    return {
      ok: false,
      error: "Product not available",
    };
  }

  if (Number(productRow.stock_quantity || 0) < quantity) {
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
    .from("products" as never)
    .select("stock_quantity")
    .eq("id", productId)
    .single();

  const productRow = product as ProductStockRow | null;

  if (!productRow) return;

  const newStock = Math.max(Number(productRow.stock_quantity || 0) - quantity, 0);

  await supabase
    .from("products" as never)
    .update({
      stock_quantity: newStock,
    } as never)
    .eq("id", productId);
}
