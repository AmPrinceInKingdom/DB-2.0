import { getPublicSiteConfig } from "@/lib/site-config";

export async function formatPrice(amount: number) {
  const config = await getPublicSiteConfig();
  return `${config.currencySymbol} ${Number(amount || 0).toLocaleString()}`;
}