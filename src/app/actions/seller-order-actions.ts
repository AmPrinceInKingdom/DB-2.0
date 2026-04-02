"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { canViewOrderForSeller } from "@/lib/auth/ownership";

const allowedStatuses = ["pending", "processing", "shipped", "delivered"] as const;

export async function updateSellerOrderStatus(formData: FormData) {
  const orderId = String(formData.get("order_id") || "");
  const status = String(formData.get("status") || "");

  if (!orderId) {
    return { error: "Order ID required." };
  }

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    return { error: "Invalid order status." };
  }

  const { supabase, allowed, role } = await canViewOrderForSeller(orderId);

  if (!allowed || role !== "seller") {
    return { error: "You can only update your own seller orders." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/orders");
  revalidatePath(`/seller/orders/${orderId}`);
  revalidatePath("/orders");

  return { success: "Order status updated." };
}