"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { restoreOrderStock } from "@/lib/restore-order-stock";
import { createNotification } from "@/lib/notifications";

const cancellableStatuses = ["pending", "processing"];

export async function cancelOrderAction(formData: FormData) {
  const orderId = String(formData.get("order_id") || "").trim();
  const cancelReason = String(formData.get("cancel_reason") || "").trim();

  if (!orderId) {
    return { error: "Order ID is required." };
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
    .select("role, is_blocked")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "Profile not found." };
  }

  if (profile.is_blocked) {
    return { error: "Your account has been blocked. Contact support." };
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, order_number, order_status, payment_status")
    .eq("id", orderId)
    .single();

  if (!order) {
    return { error: "Order not found." };
  }

  const isAdmin = profile.role === "admin";
  const isOwner = order.user_id === user.id;

  if (!isAdmin && !isOwner) {
    return { error: "You do not have permission to cancel this order." };
  }

  if (!cancellableStatuses.includes(order.order_status || "")) {
    return { error: "This order can no longer be cancelled." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      order_status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancel_reason: cancelReason || null,
    })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  await restoreOrderStock(orderId);

  await createNotification({
    userId: order.user_id,
    title: "Order cancelled",
    message: cancelReason
      ? `Your order was cancelled. Reason: ${cancelReason}`
      : "Your order was cancelled successfully.",
    link: `/orders/${order.id}`,
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/seller/orders");

  return { success: "Order cancelled successfully." };
}