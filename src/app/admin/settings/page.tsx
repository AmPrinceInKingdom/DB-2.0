import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

type SiteSettingsRow = {
  id: string;
  site_name?: string | null;
  site_tagline?: string | null;
  logo_url?: string | null;
  currency_code?: string | null;
  currency_symbol?: string | null;
  shipping_fee?: number | null;
  free_shipping_threshold?: number | null;
  support_email?: string | null;
  support_phone?: string | null;
  [key: string]: any;
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings" as never)
    .select("*")
    .limit(1)
    .single();

  const settingsRow = settings as SiteSettingsRow | null;

  if (!settingsRow) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <Settings className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
            Settings not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            The main site settings record could not be loaded. Create or restore
            the settings record to continue managing platform-wide preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Platform settings
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Admin Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Manage global marketplace settings such as branding, support details,
          shipping defaults, currency preferences, and storefront behavior.
        </p>
      </div>

      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Configuration
          </p>

          <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
            Site Settings Form
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Update the main settings used across the storefront, checkout,
            footer, and support sections.
          </p>
        </div>

        <SiteSettingsForm settings={settingsRow} />
      </div>
    </div>
  );
}