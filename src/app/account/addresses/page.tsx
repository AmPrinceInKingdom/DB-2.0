import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AccountAddressesPage() {
  const supabase = await createClient();

  // Load the current authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here if the user is not logged in.
  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Please login first
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            You need to sign in before managing your saved delivery addresses.
          </p>
        </div>
      </div>
    );
  }

  // Load all user addresses with default addresses shown first.
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const list = addresses ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Delivery settings
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              My Addresses
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Save and manage your delivery locations for faster checkout.
            </p>
          </div>

          <Link
            href="/account/addresses/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Address</span>
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <MapPin className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No addresses yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add a delivery address now so checkout becomes easier later.
          </p>

          <Link
            href="/account/addresses/new"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Add Your First Address
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {list.map((addr: any) => (
            <div
              key={addr.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {addr.recipient_name}
                      </h2>

                      {addr.is_default ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                          Default
                        </span>
                      ) : null}

                      <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold capitalize text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        {addr.address_type}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {addr.phone}
                    </p>

                    {addr.label ? (
                      <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Label: {addr.label}
                      </p>
                    ) : null}

                    <div className="mt-4 space-y-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      <p>{addr.address_line_1}</p>

                      {addr.address_line_2 ? <p>{addr.address_line_2}</p> : null}

                      <p>
                        {addr.city}
                        {addr.state ? `, ${addr.state}` : ""}
                        {addr.postal_code ? ` ${addr.postal_code}` : ""}
                      </p>

                      <p>{addr.country}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-row gap-2 sm:flex-col">
                    <Link
                      href={`/account/addresses/${addr.id}/edit`}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom info bar */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                This address can be used during checkout for delivery selection.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}