import { createClient } from "@/lib/supabase/server";
import ShopProductGrid from "@/components/shop/ShopProductGrid";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

type CategoryRow = {
  id: string;
  name?: string | null;
  slug?: string | null;
};

type ProductRow = {
  id: string;
  name?: string | null;
  slug?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  thumbnail_url?: string | null;
  short_description?: string | null;
  description?: string | null;
  stock_quantity?: number | null;
  categories?: {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
  } | null;
};

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "", sort = "newest" } = await searchParams;

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories" as never)
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  const categoryList = ((categories as CategoryRow[] | null) ?? []).filter(
    (cat): cat is CategoryRow => Boolean(cat?.id)
  );

  let query = supabase
    .from("products" as never)
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("status", "active");

  if (q.trim()) {
    const term = q.trim();
    query = query.or(
      `name.ilike.%${term}%,slug.ilike.%${term}%,sku.ilike.%${term}%`
    );
  }

  if (category.trim()) {
    query = query.eq("category_id", category);
  }

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;
  const list = (products as ProductRow[] | null) ?? [];

  const mappedProducts = list.map((product) => ({
    id: product.id,
    name: product.name || "Unnamed Product",
    slug: product.slug || "",
    price: `Rs. ${Number(product.price || 0).toLocaleString()}`,
    oldPrice: product.compare_at_price
      ? `Rs. ${Number(product.compare_at_price).toLocaleString()}`
      : undefined,
    image: product.thumbnail_url || "/images/placeholder-product.jpg",
    category: product.categories?.name || "General",
    description:
      product.short_description ||
      product.description ||
      "Clean product presentation with a simple shopping experience.",
    stockQuantity: Number(product.stock_quantity || 0),
    rating: 4.8,
    reviews: 120,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:sticky lg:top-24 lg:h-fit">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Filter products
            </p>

            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Find what you need
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Search by product name, category, and sort order with a simple
              clean layout.
            </p>
          </div>

          <form action="/shop" className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
                Search
              </label>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products..."
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
                Category
              </label>
              <select
                name="category"
                defaultValue={category}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                <option value="">All Categories</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || "Unnamed Category"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
                Sort
              </label>
              <select
                name="sort"
                defaultValue={sort}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        <section className="space-y-5">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                  Browse store
                </p>

                <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
                  Shop Products
                </h1>

                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {list.length} product{list.length === 1 ? "" : "s"} available
                  {q ? ` for “${q}”` : ""}.
                </p>
              </div>

              <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {sort === "price_asc"
                  ? "Sorted: Low to High"
                  : sort === "price_desc"
                  ? "Sorted: High to Low"
                  : "Sorted: Newest"}
              </div>
            </div>
          </div>

          <ShopProductGrid products={mappedProducts} />
        </section>
      </div>
    </div>
  );
}
