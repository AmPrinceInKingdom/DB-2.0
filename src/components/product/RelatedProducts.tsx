import ProductCard from "@/components/shared/ProductCard";

const relatedProducts = [
  {
    id: 21,
    name: "Portable Bluetooth Speaker",
    price: "Rs 12,400",
    oldPrice: "Rs 14,900",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1200&auto=format&fit=crop",
    category: "Audio",
    rating: 4.9,
    reviews: 210,
    badge: "Best Seller",
  },
  {
    id: 22,
    name: "True Wireless Earbuds",
    price: "Rs 9,990",
    oldPrice: "Rs 12,490",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1200&auto=format&fit=crop",
    category: "Audio",
    rating: 4.8,
    reviews: 112,
    badge: "Deal",
  },
  {
    id: 23,
    name: "Modern Smart Watch with Fitness Tracking",
    price: "Rs 18,900",
    oldPrice: "Rs 22,500",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    category: "Wearables",
    rating: 4.7,
    reviews: 132,
    badge: "Trending",
  },
  {
    id: 24,
    name: "Compact Mechanical Keyboard",
    price: "Rs 16,950",
    oldPrice: "Rs 19,950",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.8,
    reviews: 146,
    badge: "Hot",
  },
];

export default function RelatedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
      <div className="mb-6 max-w-xl sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Related products
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          More products you may like
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Keep browsing with a cleaner product grid and a more comfortable shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {relatedProducts.map((product) => (
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
          />
        ))}
      </div>
    </section>
  );
}