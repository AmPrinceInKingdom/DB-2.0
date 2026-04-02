"use client";

import { setDefaultAddressAction } from "@/app/actions/address-actions";

export default function SetDefaultAddressButton({
  addressId,
}: {
  addressId: string;
}) {
  return (
    <form
      action={setDefaultAddressAction}
      className="w-full"
    >
      <input type="hidden" name="address_id" value={addressId} />

      <button
        type="submit"
        className="w-full rounded border px-3 py-1 dark:border-zinc-700"
      >
        Set Default
      </button>
    </form>
  );
}