import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type WishlistProductRow = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  price?: number | null;
  thumbnail_url?: string | null;
};

type WishlistItemRow = {
  id: string;
  products?: WishlistProductRow | WishlistProductRow[] | null;
};

export default async function WishlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-primary">
            <Heart className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Please log in to view your wishlist
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to save products and view them later from your wishlist.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("wishlist_items")
    .select(
      `
      id,
      products (
        id,
        name,
        slug,
        price,
        thumbnail_url
      )
    `
    )
    .eq("user_id", user.id);

  const rawItems = (data as WishlistItemRow[] | null) ?? [];

  const items = rawItems
    .map((item) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      return {
        id: item.id,
        product,
      };
    })
    .filter(
      (
        item
      ): item is {
        id: string;
        product: WishlistProductRow;
      } => Boolean(item.product?.id)
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Heart className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
                My Wishlist
              </h1>
              <p className="text-sm text-muted-foreground">
                Products you saved for later
              </p>
            </div>
          </div>
        </div>
      </div>

      {!items.length ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-primary">
            <Heart className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Wishlist is empty
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Save products to your wishlist and come back later when you are
            ready to buy.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">
              You have{" "}
              <span className="font-semibold text-foreground">
                {items.length}
              </span>{" "}
              saved product{items.length === 1 ? "" : "s"}.
            </p>

            <Link
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Continue Browsing
            </Link>
          </div>

          {/* Wishlist grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const product = item.product;
              const price = Number(product.price || 0);

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-[24px] border border-border/70 bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    className="block"
                  >
                    <div className="overflow-hidden bg-muted">
                      <img
                        src={
                          product.thumbnail_url ||
                          "/images/placeholder-product.jpg"
                        }
                        alt={product.name || "Product"}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="space-y-3 p-4">
                    <Link
                      href={`/product/${product.slug || product.id}`}
                      className="block"
                    >
                      <p className="line-clamp-2 min-h-[3rem] text-sm font-semibold leading-6 text-foreground transition group-hover:text-primary sm:text-[15px]">
                        {product.name || "Unnamed Product"}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xl font-black tracking-tight text-foreground">
                        Rs. {price.toLocaleString()}
                      </p>

                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Saved
                      </span>
                    </div>

                    <div className="grid gap-2">
                      <Link
                        href={`/product/${product.slug || product.id}`}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        View Product
                      </Link>

                      <Link
                        href={`/product/${product.slug || product.id}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}