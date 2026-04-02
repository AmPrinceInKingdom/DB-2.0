"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canViewOrderForSeller } from "@/lib/auth/ownership";
import { createNotification } from "@/lib/notifications";

const allowedStatuses = ["processing", "shipped", "delivered"] as const;

export async function updateOrderShippingAction(formData: FormData) {
  const orderId = String(formData.get("order_id") || "").trim();
  const courierName = String(formData.get("courier_name") || "").trim();
  const trackingNumber = String(formData.get("tracking_number") || "").trim();
  const orderStatus = String(formData.get("order_status") || "").trim();

  if (!orderId) {
    return { error: "Order ID is required." };
  }

  if (
    orderStatus &&
    !allowedStatuses.includes(orderStatus as (typeof allowedStatuses)[number])
  ) {
    return { error: "Invalid shipping status." };
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

  if (!profile || !["admin", "seller"].includes(profile.role)) {
    return { error: "Admin or seller access required." };
  }

  if (profile.role === "seller") {
    const { allowed } = await canViewOrderForSeller(orderId);
    if (!allowed) {
      return { error: "You can only update your own seller orders." };
    }
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, order_number, order_status")
    .eq("id", orderId)
    .single();

  if (!order) {
    return { error: "Order not found." };
  }

  const updateData: {
    courier_name?: string | null;
    tracking_number?: string | null;
    order_status?: string;
    shipped_at?: string | null;
    delivered_at?: string | null;
  } = {
    courier_name: courierName || null,
    tracking_number: trackingNumber || null,
  };

  if (orderStatus) {
    updateData.order_status = orderStatus;

    if (orderStatus === "shipped") {
      updateData.shipped_at = new Date().toISOString();
    }

    if (orderStatus === "delivered") {
      updateData.delivered_at = new Date().toISOString();
      if (!order.order_status || order.order_status !== "shipped") {
        updateData.shipped_at = new Date().toISOString();
      }
    }
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  let notificationMessage = "Your order shipping details were updated.";

  if (orderStatus === "shipped") {
    notificationMessage = trackingNumber
      ? `Your order has been shipped. Tracking number: ${trackingNumber}`
      : "Your order has been shipped.";
  }

  if (orderStatus === "delivered") {
    notificationMessage = "Your order has been marked as delivered.";
  }

  await createNotification({
    userId: order.user_id,
    title: "Order shipping update",
    message: notificationMessage,
    link: `/orders/${order.id}`,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/seller/orders");
  revalidatePath(`/seller/orders/${order.id}`);
  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);

  return { success: "Shipping details updated successfully." };
}