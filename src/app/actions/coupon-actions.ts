"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { validateCouponForSubtotal } from "@/lib/coupons";

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function createCouponAction(formData: FormData) {
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

  const code = normalizeCode(String(formData.get("code") || ""));
  const discountType = String(formData.get("discount_type") || "fixed");
  const discountValue = Number(formData.get("discount_value") || 0);
  const minOrderAmount = Number(formData.get("min_order_amount") || 0);
  const usageLimitRaw = String(formData.get("usage_limit") || "").trim();
  const usageLimit = usageLimitRaw ? Number(usageLimitRaw) : null;
  const isActive = String(formData.get("is_active") || "") === "true";
  const expiresAtRaw = String(formData.get("expires_at") || "").trim();

  if (!code) {
    return { error: "Coupon code is required." };
  }

  if (!["fixed", "percent"].includes(discountType)) {
    return { error: "Invalid discount type." };
  }

  if (discountValue <= 0) {
    return { error: "Discount value must be greater than 0." };
  }

  if (discountType === "percent" && discountValue > 100) {
    return { error: "Percentage discount cannot be more than 100." };
  }

  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type: discountType,
    discount_value: discountValue,
    min_order_amount: minOrderAmount,
    usage_limit: usageLimit,
    is_active: isActive,
    expires_at: expiresAtRaw || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/coupons");

  return { success: "Coupon created successfully." };
}

export async function applyCouponAction(formData: FormData) {
  const code = String(formData.get("code") || "");
  const subtotal = Number(formData.get("subtotal") || 0);

  const result = await validateCouponForSubtotal(code, subtotal);

  if (!result.ok) {
    return { error: result.error };
  }

  return {
    success: "Coupon applied successfully.",
    coupon: {
      id: result.coupon.id,
      code: result.coupon.code,
      discountType: result.coupon.discountType,
      discountValue: result.coupon.discountValue,
      discountAmount: result.coupon.discountAmount,
    },
  };
}