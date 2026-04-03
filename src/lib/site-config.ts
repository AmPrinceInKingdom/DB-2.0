import { getSiteSettings } from "@/lib/get-site-settings";

type SiteSettings = {
  site_name?: string | null;
  site_tagline?: string | null;
  logo_url?: string | null;
  currency_code?: string | null;
  currency_symbol?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  shipping_fee?: number | null;
  free_shipping_threshold?: number | null;
};

export async function getPublicSiteConfig() {
  const settings = (await getSiteSettings()) as SiteSettings | null;

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
