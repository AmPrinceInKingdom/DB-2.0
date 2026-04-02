"use client";

import { useState, useTransition } from "react";
import FormMessage from "@/components/shared/FormMessage";
import { updateSiteSettingsAction } from "@/app/actions/site-settings-actions";

type Settings = {
  id: string;
  site_name: string;
  site_tagline: string | null;
  logo_url: string | null;
  currency_code: string;
  currency_symbol: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  support_email: string | null;
  support_phone: string | null;
};

export default function SiteSettingsForm({
  settings,
}: {
  settings: Settings;
}) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");

        startTransition(async () => {
          const result = await updateSiteSettingsAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Settings updated.");
        });
      }}
      className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input type="hidden" name="settings_id" value={settings.id} />

      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Site Settings
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage global store information and defaults.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="site_name"
          defaultValue={settings.site_name}
          placeholder="Site name"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="site_tagline"
          defaultValue={settings.site_tagline || ""}
          placeholder="Site tagline"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="logo_url"
          defaultValue={settings.logo_url || ""}
          placeholder="Logo URL"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="currency_code"
          defaultValue={settings.currency_code}
          placeholder="Currency code"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="currency_symbol"
          defaultValue={settings.currency_symbol}
          placeholder="Currency symbol"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="shipping_fee"
          type="number"
          step="0.01"
          defaultValue={settings.shipping_fee}
          placeholder="Shipping fee"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="free_shipping_threshold"
          type="number"
          step="0.01"
          defaultValue={settings.free_shipping_threshold}
          placeholder="Free shipping threshold"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="support_email"
          defaultValue={settings.support_email || ""}
          placeholder="Support email"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="support_phone"
          defaultValue={settings.support_phone || ""}
          placeholder="Support phone"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>

      {message ? <FormMessage type={messageType} message={message} /> : null}
    </form>
  );
}