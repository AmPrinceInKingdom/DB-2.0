"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCartItemQuantityAction(formData: FormData) {
  const cartItemId = String(formData.get("cart_item_id") || "");
  const quantity = Number(formData.get("quantity") || 1);

  if (!cartItemId) {
    return { error: "Cart item ID is required." };
  }

  const safeQuantity = Math.max(1, quantity);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const { data: cartItem, error: cartItemError } = await supabase
    .from("cart_items")
    .select(`
      id,
      cart_id,
      carts (
        user_id
      )
    `)
    .eq("id", cartItemId)
    .single();

  if (cartItemError || !cartItem) {
    return { error: "Cart item not found." };
  }

  const ownerId = Array.isArray(cartItem.carts)
    ? cartItem.carts[0]?.user_id
    : cartItem.carts?.user_id;

  if (ownerId !== user.id) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({
      quantity: safeQuantity,
    })
    .eq("id", cartItemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { success: "Quantity updated." };
}

export async function removeCartItemAction(formData: FormData) {
  const cartItemId = String(formData.get("cart_item_id") || "");

  if (!cartItemId) {
    return { error: "Cart item ID is required." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const { data: cartItem, error: cartItemError } = await supabase
    .from("cart_items")
    .select(`
      id,
      cart_id,
      carts (
        user_id
      )
    `)
    .eq("id", cartItemId)
    .single();

  if (cartItemError || !cartItem) {
    return { error: "Cart item not found." };
  }

  const ownerId = Array.isArray(cartItem.carts)
    ? cartItem.carts[0]?.user_id
    : cartItem.carts?.user_id;

  if (ownerId !== user.id) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { success: "Item removed." };
}