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
  rating?: number;
  reviews?: number;
};

type FeaturedProductsProps = {
  products?: ProductCardItem[];
};

export default function FeaturedProducts({
  products = [],
}: FeaturedProductsProps) {
  const featuredCount = products.length;

  return (
    <section className="w-full">
      <div className="rounded-[2rem] border border-border/70 bg-background shadow-sm">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {featuredCount > 0
                ? `${featuredCount} featured picks ready to explore`
                : "Popular featured picks for your homepage"}
            </p>
          </div>

          <Link
            href="/search"
            className="hidden text-sm font-semibold text-primary transition hover:opacity-80 sm:inline-block"
          >
            View all
          </Link>
        </div>

        {/* Product content */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
          {products.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
              <p className="text-lg font-bold text-foreground">
                No featured products yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Mark products as featured to show them on the homepage and make
                the store feel more active for customers.
              </p>

              <div className="mt-5">
                <Link
                  href="/search"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
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
                  rating={product.rating ?? 4.8}
                  reviews={product.reviews ?? 120}
                  badge={
                    product.oldPrice
                      ? undefined
                      : index < 2
                      ? "Popular"
                      : undefined
                  }
                  inStock={(product.stockQuantity ?? 0) > 0}
                  stockText={
                    (product.stockQuantity ?? 0) > 0
                      ? `Stock: ${product.stockQuantity ?? 0}`
                      : "Out of stock"
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="border-t border-border/70 px-4 py-4 sm:hidden">
          <Link
            href="/search"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            View all featured products
          </Link>
        </div>
      </div>
    </section>
  );
}