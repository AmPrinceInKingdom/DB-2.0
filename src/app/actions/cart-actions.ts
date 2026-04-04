"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkProductStock } from "@/lib/stock";

type AddToCartInput =
  | FormData
  | {
      product_id?: string;
      productId?: string;
      quantity?: number | string;
    };

function extractCartValues(input: AddToCartInput) {
  if (input instanceof FormData) {
    return {
      productId: String(input.get("product_id") || "").trim(),
      quantity: Number(input.get("quantity") || 1),
    };
  }

  return {
    productId: String(input.product_id || input.productId || "").trim(),
    quantity: Number(input.quantity || 1),
  };
}

export async function addToCartAction(input: AddToCartInput) {
  const { productId, quantity } = extractCartValues(input);

  if (!productId) {
    return { error: "Product ID is required." };
  }

  const safeQuantity = Math.max(1, quantity || 1);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please login first." };
  }

  const stockCheck = await checkProductStock(productId, safeQuantity);

  if (!stockCheck.ok) {
    return { error: stockCheck.error };
  }

  const { data: cart, error: cartError } = await supabase
    .from("carts" as never)
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const cartRow = cart as { id?: string } | null;

  if (cartError) {
    return { error: cartError.message };
  }

  let cartId = cartRow?.id ?? null;

  if (!cartId) {
    const { data: newCart, error: createCartError } = await supabase
      .from("carts" as never)
      .insert({
        user_id: user.id,
      } as never)
      .select("id")
      .single();

    const newCartRow = newCart as { id?: string } | null;

    if (createCartError || !newCartRow?.id) {
      return { error: createCartError?.message || "Failed to create cart." };
    }

    cartId = newCartRow.id;
  }

  const { data: existing, error: existingError } = await supabase
    .from("cart_items" as never)
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  const existingRow = existing as
    | {
        id?: string;
        quantity?: number | null;
      }
    | null;

  if (existingError) {
    return { error: existingError.message };
  }

  if (existingRow?.id) {
    const newQty = Number(existingRow.quantity || 0) + safeQuantity;

    const secondCheck = await checkProductStock(productId, newQty);

    if (!secondCheck.ok) {
      return { error: "Stock limit reached." };
    }

    const { error: updateError } = await supabase
      .from("cart_items" as never)
      .update({
        quantity: newQty,
      } as never)
      .eq("id", existingRow.id);

    if (updateError) {
      return { error: updateError.message };
    }
  } else {
    const { error: insertError } = await supabase
      .from("cart_items" as never)
      .insert({
        cart_id: cartId,
        product_id: productId,
        quantity: safeQuantity,
      } as never);

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/product/[slug]", "page");

  return { success: "Added to cart." };
}