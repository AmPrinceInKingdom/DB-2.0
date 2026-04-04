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
  {
    id: 105,
    name: "Bose Solo Soundbar 2 Home Theater",
    price: "Rs 29,990",
    oldPrice: "Rs 37,990",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop",
    category: "Flash Deal",
    rating: 4.6,
    reviews: 41,
    badge: "-21%",
    description: "Compact soundbar with cleaner living room audio setup.",
    stockQuantity: 5,
  },
  {
    id: 106,
    name: "Refurbished Stand Mixer",
    price: "Rs 44,990",
    oldPrice: "Rs 53,990",
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=1200&auto=format&fit=crop",
    category: "Flash Deal",
    rating: 4.7,
    reviews: 63,
    badge: "-17%",
    description: "Kitchen essential with premium countertop appeal.",
    stockQuantity: 7,
  },
];

/**
 * Today's deals row.
 * Search-first flow without using the old /shop route.
 */
export default function FlashDeals() {
  return (
    <section className="w-full">
      <div className="rounded-[2rem] border border-border/70 bg-background shadow-sm">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">
              Today&apos;s Deals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              All with limited-time savings
            </p>
          </div>

          <Link
            href="/search?q=deals"
            className="hidden text-sm font-semibold text-primary transition hover:opacity-80 sm:inline-block"
          >
            See all
          </Link>
        </div>

        {/* Horizontal product row */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {flashDeals.map((product) => (
              <div
                key={product.id}
                className="min-w-[250px] max-w-[250px] shrink-0 sm:min-w-[270px] sm:max-w-[270px] lg:min-w-[285px] lg:max-w-[285px]"
              >
                <ProductCard
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
                  href={`/product/${product.id}`}
                  inStock={product.stockQuantity > 0}
                  stockText={`Stock: ${product.stockQuantity}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="border-t border-border/70 px-4 py-4 sm:hidden">
          <Link
            href="/search?q=deals"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            View all deals
          </Link>
        </div>
      </div>
    </section>
  );
}