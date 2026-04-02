"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitProductReviewAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const productId = String(formData.get("product_id") || "").trim();
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "").trim();
  const productSlug = String(formData.get("product_slug") || "").trim();

  if (!productId) {
    return { error: "Product ID required." };
  }

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Rating must be 1-5." };
  }

  // check purchase
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id);

  const orderIds = (orders ?? []).map(o => o.id);

  const { data: items } = await supabase
    .from("order_items")
    .select("id")
    .eq("product_id", productId)
    .in("order_id", orderIds);

  const verifiedPurchase = (items ?? []).length > 0;

  if (!verifiedPurchase) {
    return { error: "Only buyers can review this product." };
  }

  const { error } = await supabase
    .from("product_reviews")
    .upsert(
      {
        product_id: productId,
        user_id: user.id,
        rating,
        comment: comment || null,
        is_verified_purchase: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "product_id,user_id",
      }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/product/${productSlug}`);

  return { success: "Review submitted." };
}