"use client";

import { useState, useTransition } from "react";
import { updateAddressAction } from "@/app/actions/address-actions";
import FormMessage from "@/components/shared/FormMessage";

type Address = {
  id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  address_type: string;
  is_default: boolean;
};

type EditAddressFormProps = {
  address: Address;
};

export default function EditAddressForm({ address }: EditAddressFormProps) {
  const [isDefault, setIsDefault] = useState(address.is_default);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setMessage("");
        formData.set("is_default", isDefault ? "true" : "false");

        startTransition(async () => {
          const result = await updateAddressAction(formData);

          if (result?.error) {
            setMessageType("error");
            setMessage(result.error);
            return;
          }

          setMessageType("success");
          setMessage(result?.success || "Address updated.");
        });
      }}
      className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input type="hidden" name="address_id" value={address.id} />

      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Edit Address
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update your delivery address details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="label"
          defaultValue={address.label || ""}
          placeholder="Label (Home, Office)"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <select
          name="address_type"
          defaultValue={address.address_type || "home"}
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        >
          <option value="home">home</option>
          <option value="work">work</option>
          <option value="other">other</option>
        </select>

        <input
          name="recipient_name"
          defaultValue={address.recipient_name}
          placeholder="Recipient name"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="phone"
          defaultValue={address.phone}
          placeholder="Phone number"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <input
        name="address_line_1"
        defaultValue={address.address_line_1}
        placeholder="Address line 1"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <input
        name="address_line_2"
        defaultValue={address.address_line_2 || ""}
        placeholder="Address line 2 (optional)"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="city"
          defaultValue={address.city}
          placeholder="City"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="state"
          defaultValue={address.state || ""}
          placeholder="State / Province"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="postal_code"
          defaultValue={address.postal_code || ""}
          placeholder="Postal code"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />

        <input
          name="country"
          defaultValue={address.country || "Sri Lanka"}
          placeholder="Country"
          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
        Set as default address
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>

      {message ? (
        <FormMessage type={messageType} message={message} />
      ) : null}
    </form>
  );
}