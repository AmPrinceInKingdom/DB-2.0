import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

const flashDeals = [
  {
    id: 101,
    name: "True Wireless Earbuds",
    price: "Rs 9,990",
    oldPrice: "Rs 12,490",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1200&auto=format&fit=crop",
    category: "Flash Deal",
    rating: 4.8,
    reviews: 112,
    badge: "-20%",
    description:
      "Clean audio, pocket-friendly charging case, and daily comfort.",
    stockQuantity: 18,
  },
  {
    id: 102,
    name: "Portable Power Bank 20000mAh",
    price: "Rs 7,500",
    oldPrice: "Rs 9,250",
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1200&auto=format&fit=crop",
    category: "Flash Deal",
    rating: 4.7,
    reviews: 94,
    badge: "-18%",
    description: "Reliable backup power for travel, work, and everyday use.",
    stockQuantity: 11,
  },
  {
    id: 103,
    name: "Minimal Coffee Maker",
    price: "Rs 14,800",
    oldPrice: "Rs 18,000",
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1200&auto=format&fit=crop",
    category: "Flash Deal",
    rating: 4.9,
    reviews: 76,
    badge: "-22%",
    description: "Simple countertop design with a warm premium kitchen feel.",
    stockQuantity: 6,
  },
  {
    id: 104,
    name: "Smart Home Security Camera",
    price: "Rs 21,990",
    oldPrice: "Rs 26,500",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop",
    category: "Flash Deal",
    rating: 4.8,
    reviews: 58,
    badge: "-17%",
    description: "Monitor your home with a cleaner, safer smart setup.",
    stockQuantity: 9,
  },
];

/**
 * Flash deals section.
 * This version is softened for light theme while still keeping
 * a rich premium feel in dark mode.
 */
export default function FlashDeals() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-950">
        {/* Section header */}
        <div className="flex flex-col gap-5 border-b border-zinc-200/80 bg-white/80 px-4 py-5 backdrop-blur sm:px-6 sm:py-6 dark:border-zinc-800 dark:bg-zinc-950/80 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Today&apos;s deals
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Simple deals, better shopping flow
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Limited-time offers presented in a clean layout without too many
              badges, borders, or distractions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
              Ends tonight
            </div>

            <Link
              href="/shop"
              className="hidden rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:inline-flex dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Shop deals
            </Link>
          </div>
        </div>

        {/* Product grid wrapper */}
        <div className="bg-zinc-50/70 p-4 dark:bg-zinc-950 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flashDeals.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
                category={product.category}
                rating={product.rating}
                reviews={product.reviews}
                badge={product.badge}
                description={product.description}
                inStock={product.stockQuantity > 0}
                stockText={`Stock: ${product.stockQuantity}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile only CTA */}
        <div className="bg-white px-4 pb-4 dark:bg-zinc-950 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Shop today&apos;s deals
          </Link>
        </div>
      </div>
    </section>
  );
}