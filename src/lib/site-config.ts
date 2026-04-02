import { getSiteSettings } from "@/lib/get-site-settings";

export async function getPublicSiteConfig() {
  const settings = await getSiteSettings();

  return {
    siteName: settings?.site_name || "Deal Bazaar",
    siteTagline: settings?.site_tagline || "Shop smart, live better.",
    logoUrl: settings?.logo_url || "",
    currencyCode: settings?.currency_code || "LKR",
    currencySymbol: settings?.currency_symbol || "Rs.",
    supportEmail: settings?.support_email || "",
    supportPhone: settings?.support_phone || "",
    shippingFee: Number(settings?.shipping_fee || 0),
    freeShippingThreshold: Number(settings?.free_shipping_threshold || 0),
  };
}