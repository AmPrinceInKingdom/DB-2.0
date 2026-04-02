import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteAddressButton from "@/components/account/DeleteAddressButton";
import SetDefaultAddressButton from "@/components/account/SetDefaultAddressButton";

export default async function AccountAddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        Please login first
      </div>
    );
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const list = addresses ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          My Addresses
        </h1>

        <Link
          href="/account/addresses/new"
          className="rounded-xl bg-red-600 px-4 py-2 text-white"
        >
          Add Address
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-3xl border p-10 text-center dark:border-zinc-800 dark:text-zinc-300">
          No addresses yet.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((addr: any) => (
            <div
              key={addr.id}
              className="rounded-3xl border p-5 dark:border-zinc-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div>
                  <h2 className="font-bold text-zinc-900 dark:text-white">
                    {addr.recipient_name}
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {addr.phone}
                  </p>

                  {addr.label && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      Label: {addr.label}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {addr.address_line_1}
                  </p>

                  {addr.address_line_2 && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {addr.address_line_2}
                    </p>
                  )}

                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}
                    {addr.postal_code ? ` ${addr.postal_code}` : ""}
                  </p>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {addr.country}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs capitalize dark:bg-zinc-900 dark:text-zinc-300">
                      {addr.address_type}
                    </span>

                    {addr.is_default && (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 dark:bg-green-950 dark:text-green-300">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/account/addresses/${addr.id}/edit`}
                    className="rounded border px-3 py-1 text-center dark:border-zinc-700 dark:text-white"
                  >
                    Edit
                  </Link>

                  {!addr.is_default && (
                    <SetDefaultAddressButton addressId={addr.id} />
                  )}

                  <DeleteAddressButton addressId={addr.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}