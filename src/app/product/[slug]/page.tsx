import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviewForm from "@/components/product/ProductReviewForm";
import ProductReviewsList from "@/components/product/ProductReviewsList";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  // Load the product with its category details.
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .single();

  // Show a clean empty state if the product does not exist.
  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Product not found
        </div>
      </div>
    );
  }

  // Load gallery images and reviews in parallel for better performance.
  const [{ data: images }, { data: reviews }] = await Promise.all([
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", product.id)
      .order("sort_order"),
    supabase
      .from("product_reviews")
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .eq("product_id", product.id)
      .order("created_at", { ascending: false }),
  ]);

  // Build the gallery image list using cover image + extra gallery images.
  const imageUrls = [
    ...(product.thumbnail_url ? [product.thumbnail_url] : []),
    ...((images ?? []).map((img: any) => img.image_url)),
  ];

  // Prepare review summary values.
  const reviewList = reviews ?? [];
  const reviewCount = reviewList.length;
  const averageRating =
    reviewCount > 0
      ? reviewList.reduce((sum: number, item: any) => sum + item.rating, 0) /
        reviewCount
      : 4.8;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Top product area */}
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        {/* Gallery panel */}
        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <ProductGallery images={imageUrls || []} />
        </div>

        {/* Product information panel */}
        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <ProductInfo
            id={product.id}
            name={product.name}
            category={product.categories?.name || "Product"}
            price={`Rs. ${Number(product.price || 0).toLocaleString()}`}
            oldPrice={
              product.compare_at_price
                ? `Rs. ${Number(product.compare_at_price).toLocaleString()}`
                : undefined
            }
            description={product.description || ""}
            rating={averageRating}
            reviews={reviewCount}
            sku={product.sku || "DB-001"}
            stockQuantity={product.stock_quantity || 0}
            highlights={
              product.short_description ? [product.short_description] : []
            }
          />
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <ProductReviewForm productId={product.id} productSlug={slug} />
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Customer feedback
            </p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Ratings & Reviews
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Real feedback from customers who purchased this product.
            </p>
          </div>

          <ProductReviewsList reviews={reviewList} />
        </div>
      </div>
    </div>
  );
}