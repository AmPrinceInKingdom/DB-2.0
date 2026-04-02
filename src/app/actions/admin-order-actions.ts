"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type AllowedOrderStatus = (typeof allowedStatuses)[number];

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("order_id") || "");
  const nextStatus = String(formData.get("order_status") || "") as AllowedOrderStatus;

  if (!orderId) {
    return { error: "Order ID is required." };
  }

  if (!allowedStatuses.includes(nextStatus)) {
    return { error: "Invalid order status." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Admin access required." };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      order_status: nextStatus,
    })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return { success: "Order status updated." };
}