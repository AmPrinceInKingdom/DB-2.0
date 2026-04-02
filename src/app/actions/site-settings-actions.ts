"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteSettingsAction(formData: FormData) {
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

  const siteName = String(formData.get("site_name") || "").trim();
  const siteTagline = String(formData.get("site_tagline") || "").trim();
  const logoUrl = String(formData.get("logo_url") || "").trim();
  const currencyCode = String(formData.get("currency_code") || "").trim();
  const currencySymbol = String(formData.get("currency_symbol") || "").trim();
  const shippingFee = Number(formData.get("shipping_fee") || 0);
  const freeShippingThreshold = Number(
    formData.get("free_shipping_threshold") || 0
  );
  const supportEmail = String(formData.get("support_email") || "").trim();
  const supportPhone = String(formData.get("support_phone") || "").trim();
  const settingsId = String(formData.get("settings_id") || "").trim();

  if (!settingsId) {
    return { error: "Settings ID is required." };
  }

  if (!siteName) {
    return { error: "Site name is required." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: siteName,
      site_tagline: siteTagline || null,
      logo_url: logoUrl || null,
      currency_code: currencyCode || "LKR",
      currency_symbol: currencySymbol || "Rs.",
      shipping_fee: shippingFee,
      free_shipping_threshold: freeShippingThreshold,
      support_email: supportEmail || null,
      support_phone: supportPhone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", settingsId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/checkout");

  return { success: "Site settings updated successfully." };
}