"use server";

import { createClient } from "@/lib/supabase/server";
import { reduceProductStock, checkProductStock } from "@/lib/stock";
import { validateCouponForSubtotal } from "@/lib/coupons";
import { calculateShipping } from "@/lib/shipping";
import { createNotification } from "@/lib/notifications";
import { redirect } from "next/navigation";

export async function createOrderAction(formData: FormData) {
  const addressId = String(formData.get("address_id") || "");
  const paymentMethod = String(formData.get("payment_method") || "");
  const couponId = String(formData.get("coupon_id") || "").trim();
  const couponCode = String(formData.get("coupon_code") || "").trim();
  const submittedDiscountAmount = Number(formData.get("discount_amount") || 0);
  const submittedSubtotalAmount = Number(formData.get("subtotal_amount") || 0);
  const submittedShippingAmount = Number(formData.get("shipping_amount") || 0);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please login" };
  }

  const { data: cart } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (
        id,
        name,
        price,
        stock_quantity,
        status
      )
    `)
    .eq("user_id", user.id);

  if (!cart || cart.length === 0) {
    return { error: "Cart empty" };
  }

  for (const item of cart) {
    const check = await checkProductStock(item.product_id, item.quantity);

    if (!check.ok) {
      return {
        error: `Stock issue with ${item.products.name}`,
      };
    }
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.products.price || 0),
    0
  );

  let discountAmount = 0;
  let finalCouponId: string | null = null;
  let finalCouponCode: string | null = null;

  if (couponCode) {
    const couponResult = await validateCouponForSubtotal(couponCode, subtotal);

    if (!couponResult.ok) {
      return { error: couponResult.error };
    }

    discountAmount = couponResult.coupon.discountAmount;
    finalCouponId = couponResult.coupon.id;
    finalCouponCode = couponResult.coupon.code;

    if (couponId && couponId !== finalCouponId) {
      return { error: "Coupon mismatch detected." };
    }
  }

  if (submittedSubtotalAmount && Number(submittedSubtotalAmount) !== subtotal) {
    return { error: "Subtotal changed. Please apply coupon again." };
  }

  if (
    submittedDiscountAmount &&
    Math.abs(Number(submittedDiscountAmount) - discountAmount) > 0.01
  ) {
    return { error: "Coupon discount changed. Please apply coupon again." };
  }

  const shipping = await calculateShipping(subtotal);
  const shippingAmount = shipping.shippingAmount;

  if (
    Math.abs(Number(submittedShippingAmount || 0) - Number(shippingAmount || 0)) > 0.01
  ) {
    return { error: "Shipping changed. Please try checkout again." };
  }

  const total = Math.max(subtotal - discountAmount + shippingAmount, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      address_id: addressId || null,
      payment_method: paymentMethod,
      subtotal_amount: subtotal,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      total_amount: total,
      coupon_id: finalCouponId,
      coupon_code: finalCouponCode,
      order_status: "pending",
      payment_status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || "Failed to create order." };
  }

  for (const item of cart) {
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.products.price,
    });

    if (itemError) {
      return { error: itemError.message };
    }

    await reduceProductStock(item.product_id, item.quantity);
  }

  if (finalCouponId) {
    const { data: existingCoupon } = await supabase
      .from("coupons")
      .select("used_count")
      .eq("id", finalCouponId)
      .single();

    await supabase
      .from("coupons")
      .update({
        used_count: Number(existingCoupon?.used_count || 0) + 1,
      })
      .eq("id", finalCouponId);
  }

  await createNotification({
    userId: user.id,
    title: "Order placed successfully",
    message: `Your order #${order.id} has been placed.`,
    link: `/orders/${order.id}`,
  });

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  redirect(`/orders/${order.id}`);
}