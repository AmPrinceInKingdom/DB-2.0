import { createClient } from "@/lib/supabase/server";
import ShopProductGrid from "@/components/shop/ShopProductGrid";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "", sort = "newest" } = await searchParams;

  const supabase = await createClient();

  // Load active categories for the filter sidebar.
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  // Start the product query with active products only.
  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("status", "active");

  // Apply text search across useful product fields.
  if (q.trim()) {
    const term = q.trim();
    query = query.or(
      `name.ilike.%${term}%,slug.ilike.%${term}%,sku.ilike.%${term}%`
    );
  }

  // Apply category filter when selected.
  if (category.trim()) {
    query = query.eq("category_id", category);
  }

  // Apply sorting.
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;
  const list = products ?? [];

  // Convert database products into the UI shape used by ShopProductGrid.
  const mappedProducts = list.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
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
        {/* Filter sidebar */}
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
            {/* Search input */}
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

            {/* Category filter */}
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
                {(categories ?? []).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort filter */}
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

        {/* Main content */}
        <section className="space-y-5">
          {/* Top intro panel */}
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

          {/* Product grid */}
          <ShopProductGrid products={mappedProducts} />
        </section>
      </div>
    </div>
  );
}