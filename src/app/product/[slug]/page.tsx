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

type ProductRow = {
  id: string;
  name?: string | null;
  description?: string | null;
  short_description?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  thumbnail_url?: string | null;
  sku?: string | null;
  stock_quantity?: number | null;
  categories?: {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
  } | null;
};

type ProductImageRow = {
  id: string;
  image_url?: string | null;
};

type ProductReviewRow = {
  id: string;
  rating?: number | null;
  comment?: string | null;
  created_at?: string | null;
  is_verified_purchase?: boolean | null;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
  [key: string]: any;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: product } = await supabase
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
    .eq("slug", slug)
    .single();

  const productRow = product as ProductRow | null;

  if (!productRow) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Product not found
        </div>
      </div>
    );
  }

  const [{ data: images }, { data: reviews }] = await Promise.all([
    supabase
      .from("product_images" as never)
      .select("*")
      .eq("product_id", productRow.id)
      .order("sort_order"),
    supabase
      .from("product_reviews" as never)
      .select(
        `
        *,
        profiles (
          full_name,
          email
        )
      `
      )
      .eq("product_id", productRow.id)
      .order("created_at", { ascending: false }),
  ]);

  const imageRows = (images as ProductImageRow[] | null) ?? [];
  const reviewRows = (reviews as ProductReviewRow[] | null) ?? [];

  const imageUrls = [
    ...(productRow.thumbnail_url ? [productRow.thumbnail_url] : []),
    ...imageRows
      .map((img) => img.image_url)
      .filter((url): url is string => Boolean(url)),
  ];

  const reviewCount = reviewRows.length;
  const averageRating =
    reviewCount > 0
      ? reviewRows.reduce((sum: number, item: ProductReviewRow) => {
          return sum + Number(item.rating || 0);
        }, 0) / reviewCount
      : 4.8;

  const reviewList = reviewRows.map((review) => ({
    id: review.id,
    rating: Number(review.rating || 0),
    comment: review.comment || "",
    created_at: review.created_at || "",
    is_verified_purchase: Boolean(review.is_verified_purchase),
    profiles: {
      full_name: review.profiles?.full_name || "",
      email: review.profiles?.email || "",
    },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <ProductGallery images={imageUrls} />
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <ProductInfo
            id={productRow.id}
            name={productRow.name || "Unnamed Product"}
            category={productRow.categories?.name || "Product"}
            price={`Rs. ${Number(productRow.price || 0).toLocaleString()}`}
            oldPrice={
              productRow.compare_at_price
                ? `Rs. ${Number(productRow.compare_at_price).toLocaleString()}`
                : undefined
            }
            description={productRow.description || ""}
            rating={averageRating}
            reviews={reviewCount}
            sku={productRow.sku || "DB-001"}
            stockQuantity={productRow.stock_quantity || 0}
            highlights={
              productRow.short_description
                ? [productRow.short_description]
                : []
            }
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-5">
          <ProductReviewForm productId={productRow.id} productSlug={slug} />
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
