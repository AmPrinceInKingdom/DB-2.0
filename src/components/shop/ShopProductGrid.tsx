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
  rating?: number;
  reviews?: number;
};

type ShopProductGridProps = {
  products?: ProductCardItem[];
};

export default function ShopProductGrid({
  products = [],
}: ShopProductGridProps) {
  // Show a clean empty state when there are no products.
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        No products available yet.
      </div>
    );
  }

  return (
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
          rating={product.rating ?? 4.8}
          reviews={product.reviews ?? 120}
          href={`/product/${product.slug}`}
          badge={product.oldPrice ? "-15%" : undefined}
          inStock={(product.stockQuantity ?? 0) > 0}
          stockText={`Stock: ${product.stockQuantity ?? 0}`}
        />
      ))}
    </div>
  );
}