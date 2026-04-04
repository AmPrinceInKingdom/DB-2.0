"use client";

import { useState, useTransition } from "react";
import { createAddressAction } from "@/app/actions/address-actions";
import FormMessage from "@/components/shared/FormMessage";

export default function AddAddressForm() {
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
          const result = await createAddressAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Address added.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Add Address
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Save a delivery address for checkout.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="label"
          placeholder="Label (Home, Office)"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <select
          name="address_type"
          defaultValue="home"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="home">home</option>
          <option value="work">work</option>
          <option value="other">other</option>
        </select>

        <input
          name="recipient_name"
          placeholder="Recipient name"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="phone"
          placeholder="Phone number"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <input
        name="address_line_1"
        placeholder="Address line 1"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <input
        name="address_line_2"
        placeholder="Address line 2 (optional)"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="city"
          placeholder="City"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="state"
          placeholder="State / Province"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="postal_code"
          placeholder="Postal code"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="country"
          defaultValue="Sri Lanka"
          placeholder="Country"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" name="is_default" value="true" />
        Set as default address
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Address"}
      </button>

      {message ? (
        <FormMessage type={messageType} message={message} />
      ) : null}
    </form>
  );
}