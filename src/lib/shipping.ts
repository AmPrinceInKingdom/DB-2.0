import { createClient } from "@/lib/supabase/server";

type SiteSettingsRow = {
  shipping_fee?: number | null;
  free_shipping_threshold?: number | null;
};

export async function calculateShipping(subtotal: number) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings" as never)
    .select("shipping_fee, free_shipping_threshold")
    .limit(1)
    .single();

  const settingsRow = settings as SiteSettingsRow | null;

  const shippingFee = Number(settingsRow?.shipping_fee || 0);
  const freeShippingThreshold = Number(
    settingsRow?.free_shipping_threshold || 0
  );

  const isFreeShipping =
    freeShippingThreshold > 0 && subtotal >= freeShippingThreshold;

  return {
    shippingFee,
    freeShippingThreshold,
    isFreeShipping,
    shippingAmount: isFreeShipping ? 0 : shippingFee,
  };
}
