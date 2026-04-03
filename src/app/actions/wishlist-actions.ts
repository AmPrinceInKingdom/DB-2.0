"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleWishlistAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Login required" };
  }

  const productId = String(formData.get("product_id") || "");

  const { data: existing } = await supabase
    .from("wishlist_items" as never)
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  const existingRow = existing as { id?: string } | null;

  if (existingRow?.id) {
    await supabase
      .from("wishlist_items" as never)
      .delete()
      .eq("id", existingRow.id);
  } else {
    await supabase
      .from("wishlist_items" as never)
      .insert({
        user_id: user.id,
        product_id: productId,
      } as never);
  }

  revalidatePath("/");
  revalidatePath("/wishlist");

  return { success: true };
}