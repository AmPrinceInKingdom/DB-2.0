import { createClient } from "@/lib/supabase/server";

type CouponRow = {
  id: string;
  code: string;
  discount_type: "fixed" | "percent";
  discount_value: number | null;
  is_active: boolean | null;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number | null;
  min_order_amount: number | null;
};

export type ValidatedCouponResult =
  | {
      ok: true;
      coupon: {
        id: string;
        code: string;
        discountType: "fixed" | "percent";
        discountValue: number;
        discountAmount: number;
      };
    }
  | {
      ok: false;
      error: string;
    };

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function validateCouponForSubtotal(
  rawCode: string,
  subtotal: number
): Promise<ValidatedCouponResult> {
  const code = normalizeCode(rawCode);

  if (!code) {
    return { ok: false, error: "Please enter a coupon code." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons" as never)
    .select("*")
    .eq("code", code)
    .maybeSingle();

  const coupon = data as CouponRow | null;

  if (error || !coupon) {
    return { ok: false, error: "Invalid coupon code." };
  }

  if (!coupon.is_active) {
    return { ok: false, error: "This coupon is inactive." };
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "This coupon has expired." };
  }

  if (
    coupon.usage_limit !== null &&
    Number(coupon.used_count || 0) >= Number(coupon.usage_limit)
  ) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }

  if (subtotal < Number(coupon.min_order_amount || 0)) {
    return {
      ok: false,
      error: `Minimum order amount is Rs. ${Number(
        coupon.min_order_amount || 0
      ).toLocaleString()}.`,
    };
  }

  let discountAmount = 0;

  if (coupon.discount_type === "fixed") {
    discountAmount = Number(coupon.discount_value || 0);
  } else {
    discountAmount = (subtotal * Number(coupon.discount_value || 0)) / 100;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    ok: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: Number(coupon.discount_value || 0),
      discountAmount,
    },
  };
}
