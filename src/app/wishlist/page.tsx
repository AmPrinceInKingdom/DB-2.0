import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function WishlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          Please log in to view wishlist
        </p>
      </div>
    );
  }

  const { data } = await supabase
    .from("wishlist_items")
    .select(`
      id,
      products (
        id,
        name,
        slug,
        price,
        thumbnail_url
      )
    `)
    .eq("user_id", user.id);

  const items = data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Heart className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              My Wishlist
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Products you saved for later
            </p>
          </div>
        </div>
      </div>

      {!items.length ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <Heart className="mx-auto h-8 w-8 text-zinc-400" />

          <h2 className="mt-3 text-lg font-bold text-zinc-900 dark:text-white">
            Wishlist is empty
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Save products to view them later
          </p>

          <Link
            href="/shop"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item: any) => {
            const product = item.products;

            return (
              <Link
                key={item.id}
                href={`/product/${product.slug}`}
                className="group overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <img
                  src={
                    product.thumbnail_url ||
                    "/images/placeholder-product.jpg"
                  }
                  className="h-48 w-full object-cover transition group-hover:scale-105"
                />

                <div className="p-4">
                  <p className="line-clamp-2 font-semibold text-zinc-900 dark:text-white">
                    {product.name}
                  </p>

                  <p className="mt-2 text-lg font-bold text-red-600">
                    Rs. {Number(product.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}