import Link from "next/link";
import { PackageSearch, Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function SellerProductsPage({ searchParams }: Props) {
  const { search = "" } = await searchParams;
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here if the user is not logged in.
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  // Confirm seller access.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Seller access required.
        </div>
      </div>
    );
  }

  // Build the seller product query.
  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (search.trim()) {
    const term = search.trim();
    query = query.or(
      `name.ilike.%${term}%,slug.ilike.%${term}%,sku.ilike.%${term}%`
    );
  }

  const { data: products } = await query;
  const list = products ?? [];

  function getStatusClasses(status: string) {
    if (status === "active") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (status === "draft") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }

    if (status === "archived") {
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Seller products
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              My Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Manage all products under your seller account, check stock, and
              open product editing tools from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/seller/products/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>

            <form className="flex gap-3" action="/seller/products">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search name, slug, or SKU"
                  className="h-11 w-full rounded-full border border-zinc-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <PackageSearch className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No seller products found
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add your first product to start building your seller storefront.
          </p>

          <Link
            href="/seller/products/new"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((product: any) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[1fr_220px]">
                  {/* Left side */}
                  <div className="flex min-w-0 flex-col gap-5 sm:flex-row">
                    <img
                      src={
                        product.thumbnail_url || "/images/placeholder-product.jpg"
                      }
                      alt={product.name}
                      className="h-24 w-24 rounded-[20px] object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {product.name}
                      </h2>

                      <div className="mt-2 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                        <p>Slug: {product.slug}</p>
                        <p>SKU: {product.sku || "-"}</p>
                        <p>Category: {product.categories?.name || "General"}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                            String(product.status || "")
                          )}`}
                        >
                          {product.status || "draft"}
                        </span>

                        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          Featured: {product.is_featured ? "Yes" : "No"}
                        </span>

                        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          Stock: {product.stock_quantity}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Price
                          </p>
                          <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                            Rs. {Number(product.price || 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Compare At
                          </p>
                          <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                            {product.compare_at_price
                              ? `Rs. ${Number(product.compare_at_price).toLocaleString()}`
                              : "-"}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Created
                          </p>
                          <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                            {product.created_at
                              ? new Date(product.created_at).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex w-full flex-col gap-3 xl:w-auto">
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
                    >
                      Edit Product
                    </Link>

                    <Link
                      href={`/product/${product.slug}`}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom helper bar */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                Use this page to monitor stock, product status, and update your
                listings quickly.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}