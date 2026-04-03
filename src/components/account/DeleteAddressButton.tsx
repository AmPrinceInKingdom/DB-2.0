"use client";

import { deleteAddressAction } from "@/app/actions/address-actions";

export default function DeleteAddressButton({
  addressId,
}: {
  addressId: string;
}) {
  return (
    <form
      action={deleteAddressAction}
      className="w-full"
    >
      <input type="hidden" name="address_id" value={addressId} />

      <button
        type="submit"
        className="w-full rounded border px-3 py-1 text-red-600 dark:border-zinc-700"
      >
        Delete
      </button>
    </form>
  );
}