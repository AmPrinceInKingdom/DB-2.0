import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type AddressRow = {
  id: string;
  recipient_name?: string | null;
  phone?: string | null;
  label?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  address_type?: string | null;
  is_default?: boolean | null;
};

export default async function AccountAddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            Please login first
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You need to sign in before managing your saved delivery addresses.
          </p>
        </div>
      </div>
    );
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const list = (addresses as AddressRow[] | null) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6 lg:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Delivery settings
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
                My Addresses
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
                Save and manage your delivery locations for faster checkout.
              </p>
            </div>

            <Link
              href="/account/addresses/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>Add Address</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary row */}
      {list.length > 0 ? (
        <div className="mt-6 rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-foreground">{list.length}</span>{" "}
            saved address{list.length === 1 ? "" : "es"} for checkout and
            delivery.
          </p>
        </div>
      ) : null}

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-6 w-6 text-primary" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            No addresses yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add a delivery address now so checkout becomes easier later.
          </p>

          <Link
            href="/account/addresses/new"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Add Your First Address
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {list.map((addr) => (
            <div
              key={addr.id}
              className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        {addr.recipient_name || "Unnamed recipient"}
                      </h2>

                      {addr.is_default ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                          Default
                        </span>
                      ) : null}

                      {addr.address_type ? (
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                          {addr.address_type}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {addr.phone || "-"}
                    </p>

                    {addr.label ? (
                      <p className="mt-2 text-sm font-medium text-foreground">
                        Label: {addr.label}
                      </p>
                    ) : null}

                    <div className="mt-4 rounded-[22px] border border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                      <p>{addr.address_line_1 || "-"}</p>
                      {addr.address_line_2 ? <p>{addr.address_line_2}</p> : null}
                      <p>
                        {addr.city || ""}
                        {addr.state ? `, ${addr.state}` : ""}
                        {addr.postal_code ? ` ${addr.postal_code}` : ""}
                      </p>
                      <p>{addr.country || "-"}</p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 sm:flex-col">
                    <Link
                      href={`/account/addresses/${addr.id}/edit`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/70 bg-muted/20 px-5 py-3 text-xs text-muted-foreground md:px-6">
                This address can be used during checkout for delivery selection.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
