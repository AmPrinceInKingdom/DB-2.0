import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

type ProductCardItem = {
  id: string;
  name: string;
  slug: string;
  price: string;
  oldPrice?: string;
  image: string;
  category: string;
  description?: string;
  stockQuantity?: number;
  isFeatured?: boolean;
};

type FeaturedProductsProps = {
  products?: ProductCardItem[]; // important
};

export default function FeaturedProducts({
  products = [], // fallback
}: FeaturedProductsProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600">
            Featured Picks
          </p>

          <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
            Popular products for you
          </h2>
        </div>

        <Link
          href="/shop"
          className="text-sm font-semibold text-red-600 transition hover:text-red-700"
        >
          View all
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          No featured products yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
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
              badge={product.oldPrice ? "-20%" : undefined}
              inStock={(product.stockQuantity ?? 0) > 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}