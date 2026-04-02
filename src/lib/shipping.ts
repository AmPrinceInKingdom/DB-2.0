import { createClient } from "@/lib/supabase/server";

export async function calculateShipping(subtotal: number) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("shipping_fee, free_shipping_threshold")
    .limit(1)
    .single();

  const shippingFee = Number(settings?.shipping_fee || 0);
  const freeShippingThreshold = Number(settings?.free_shipping_threshold || 0);

  const isFreeShipping =
    freeShippingThreshold > 0 && subtotal >= freeShippingThreshold;

  return {
    shippingFee,
    freeShippingThreshold,
    isFreeShipping,
    shippingAmount: isFreeShipping ? 0 : shippingFee,
  };
}