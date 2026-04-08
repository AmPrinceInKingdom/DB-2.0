import { NextResponse } from "next/server";
import { requireApiSuperAdmin } from "@/lib/api-auth";
import { normalizeCouponCode } from "@/lib/coupons";
import { updateCouponSchema } from "@/lib/validations/coupon";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const auth = await requireApiSuperAdmin();
  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid coupon update." },
      { status: 400 },
    );
  }

  const payload = {
    ...parsed.data,
    code: parsed.data.code ? normalizeCouponCode(parsed.data.code) : undefined,
    description:
      parsed.data.description === undefined
        ? undefined
        : parsed.data.description || null,
    starts_at:
      parsed.data.starts_at === undefined ? undefined : parsed.data.starts_at,
    ends_at: parsed.data.ends_at === undefined ? undefined : parsed.data.ends_at,
    max_discount_amount:
      parsed.data.max_discount_amount === undefined
        ? undefined
        : parsed.data.max_discount_amount,
    usage_limit:
      parsed.data.usage_limit === undefined ? undefined : parsed.data.usage_limit,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await auth.supabase
    .from("coupons")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ coupon: data });
}
