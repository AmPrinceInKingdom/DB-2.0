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
    .from("cart_items" as never)
    .select(`
      id,
      cart_id,
      carts (
        user_id
      )
    `)
    .eq("id", cartItemId)
    .single();

  const cartItemRow = cartItem as
    | {
        id?: string;
        cart_id?: string;
        carts?: { user_id?: string } | { user_id?: string }[] | null;
      }
    | null;

  if (cartItemError || !cartItemRow) {
    return { error: "Cart item not found." };
  }

  const ownerId = Array.isArray(cartItemRow.carts)
    ? cartItemRow.carts[0]?.user_id
    : cartItemRow.carts?.user_id;

  if (ownerId !== user.id) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("cart_items" as never)
    .update({
      quantity: safeQuantity,
    } as never)
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
    .from("cart_items" as never)
    .select(`
      id,
      cart_id,
      carts (
        user_id
      )
    `)
    .eq("id", cartItemId)
    .single();

  const cartItemRow = cartItem as
    | {
        id?: string;
        cart_id?: string;
        carts?: { user_id?: string } | { user_id?: string }[] | null;
      }
    | null;

  if (cartItemError || !cartItemRow) {
    return { error: "Cart item not found." };
  }

  const ownerId = Array.isArray(cartItemRow.carts)
    ? cartItemRow.carts[0]?.user_id
    : cartItemRow.carts?.user_id;

  if (ownerId !== user.id) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("cart_items" as never)
    .delete()
    .eq("id", cartItemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { success: "Item removed." };
}