import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

type SearchProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  oldPrice?: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  stockQuantity: number;
};

const allProducts: SearchProduct[] = [
  {
    id: 101,
    name: "True Wireless Earbuds",
    slug: "true-wireless-earbuds",
    price: "Rs 9,990",
    oldPrice: "Rs 12,490",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1200&auto=format&fit=crop",
    category: "Electronics",
    description: "Clean audio, portable case, and comfortable daily use.",
    rating: 4.8,
    reviews: 112,
    stockQuantity: 18,
  },
  {
    id: 102,
    name: "Portable Power Bank 20000mAh",
    slug: "portable-power-bank-20000mah",
    price: "Rs 7,500",
    oldPrice: "Rs 9,250",
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1200&auto=format&fit=crop",
    category: "Accessories",
    description: "Reliable backup power for travel, work, and everyday use.",
    rating: 4.7,
    reviews: 94,
    stockQuantity: 11,
  },
  {
    id: 103,
    name: "Minimal Coffee Maker",
    slug: "minimal-coffee-maker",
    price: "Rs 14,800",
    oldPrice: "Rs 18,000",
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1200&auto=format&fit=crop",
    category: "Home & Living",
    description: "Simple countertop design with a warm premium kitchen feel.",
    rating: 4.9,
    reviews: 76,
    stockQuantity: 6,
  },
  {
    id: 104,
    name: "Smart Home Security Camera",
    slug: "smart-home-security-camera",
    price: "Rs 21,990",
    oldPrice: "Rs 26,500",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop",
    category: "Home & Living",
    description: "Monitor your home with a cleaner, safer smart setup.",
    rating: 4.8,
    reviews: 58,
    stockQuantity: 9,
  },
  {
    id: 105,
    name: "Gaming Mechanical Keyboard",
    slug: "gaming-mechanical-keyboard",
    price: "Rs 13,500",
    oldPrice: "Rs 16,000",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format&fit=crop",
    category: "Gaming",
    description: "RGB keyboard with responsive switches for gaming setups.",
    rating: 4.7,
    reviews: 88,
    stockQuantity: 14,
  },
  {
    id: 106,
    name: "Slim Business Laptop",
    slug: "slim-business-laptop",
    price: "Rs 189,990",
    oldPrice: "Rs 209,990",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
    category: "Electronics",
    description: "Clean design laptop for work, study, and daily productivity.",
    rating: 4.8,
    reviews: 51,
    stockQuantity: 4,
  },
  {
    id: 107,
    name: "Android Smartphone Pro",
    slug: "android-smartphone-pro",
    price: "Rs 124,990",
    oldPrice: "Rs 139,990",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    category: "Phones",
    description: "Fast modern smartphone with strong camera and battery life.",
    rating: 4.9,
    reviews: 143,
    stockQuantity: 7,
  },
  {
    id: 108,
    name: "Wireless Gaming Mouse",
    slug: "wireless-gaming-mouse",
    price: "Rs 8,900",
    oldPrice: "Rs 10,500",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop",
    category: "Gaming",
    description: "Comfortable grip and quick response for competitive play.",
    rating: 4.6,
    reviews: 67,
    stockQuantity: 21,
  },
];

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const sort = params.sort?.trim() ?? "newest";

  const normalizedQuery = query.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  const filteredResults = allProducts.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      !normalizedCategory ||
      normalizedCategory === "all categories" ||
      product.category.toLowerCase() === normalizedCategory;

    return matchesQuery && matchesCategory;
  });

  const results = [...filteredResults].sort((a, b) => {
    if (sort === "price_asc") {
      return parsePrice(a.price) - parsePrice(b.price);
    }

    if (sort === "price_desc") {
      return parsePrice(b.price) - parsePrice(a.price);
    }

    return b.id - a.id;
  });

  const sortLabel =
    sort === "price_asc"
      ? "Price: Low to High"
      : sort === "price_desc"
      ? "Price: High to Low"
      : "Newest";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/70 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Search Results
                </p>

                <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">
                  {query ? `Results for "${query}"` : "Browse Products"}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  {category && category !== "All Categories"
                    ? `Category: ${category}`
                    : "Showing products from all categories"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-border bg-muted/30 px-4 py-2 text-sm font-semibold text-muted-foreground">
                  {results.length} product{results.length === 1 ? "" : "s"}
                </div>

                <div className="rounded-full border border-border bg-muted/30 px-4 py-2 text-sm font-semibold text-muted-foreground">
                  Sorted: {sortLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-border/70 px-4 py-4 sm:px-6 lg:px-8">
            <form
              action="/search"
              className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]"
            >
              <input type="hidden" name="category" value={category} />

              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products..."
                className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40"
              />

              <select
                name="category"
                defaultValue={category}
                className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Phones">Phones</option>
                <option value="Gaming">Gaming</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Living">Home & Living</option>
              </select>

              <select
                name="sort"
                defaultValue={sort}
                className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Apply
              </button>
            </form>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {results.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                <h2 className="text-xl font-bold text-foreground">
                  No products found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                  Try another search word or choose a different category to find
                  products faster.
                </p>

                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    Back to Home
                  </Link>

                  <Link
                    href="/search"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {results.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={product.image}
                    category={product.category}
                    description={product.description}
                    href={`/product/${product.slug}`}
                    rating={product.rating}
                    reviews={product.reviews}
                    badge={index < 2 ? "Popular" : undefined}
                    inStock={product.stockQuantity > 0}
                    stockText={
                      product.stockQuantity > 0
                        ? `Stock: ${product.stockQuantity}`
                        : "Out of stock"
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}