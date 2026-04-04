import { CreditCard, Landmark, ShieldCheck, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviewForm from "@/components/product/ProductReviewForm";
import ProductReviewsList from "@/components/product/ProductReviewsList";
import ProductCard from "@/components/shared/ProductCard";

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
  category_id?: string | null;
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

type RelatedProductRow = {
  id: string;
  name?: string | null;
  slug?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  thumbnail_url?: string | null;
  stock_quantity?: number | null;
  short_description?: string | null;
  categories?: {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
  } | null;
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
        <div className="rounded-[28px] border border-dashed border-border bg-background p-10 text-center text-muted-foreground shadow-sm">
          Product not found
        </div>
      </div>
    );
  }

  const relatedQuery = supabase
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
    .neq("id", productRow.id)
    .eq("status", "active")
    .limit(8);

  const relatedQueryWithCategory =
    productRow.category_id && typeof productRow.category_id === "string"
      ? relatedQuery.eq("category_id", productRow.category_id)
      : relatedQuery;

  const [{ data: images }, { data: reviews }, { data: relatedProductsData }] =
    await Promise.all([
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
      relatedQueryWithCategory,
    ]);

  const imageRows = (images as ProductImageRow[] | null) ?? [];
  const reviewRows = (reviews as ProductReviewRow[] | null) ?? [];
  const relatedProducts = (relatedProductsData as RelatedProductRow[] | null) ?? [];

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

  const highlights =
    productRow.short_description && productRow.short_description.trim()
      ? [productRow.short_description]
      : [
          "Bank transfer and card payment supported",
          "Cash on delivery coming soon",
          "Clean and secure checkout flow",
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Top product area */}
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/70 bg-muted/30 p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Product Gallery
            </p>
          </div>

          <div className="p-4 md:p-5">
            <ProductGallery images={imageUrls} />
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/70 bg-gradient-to-r from-primary/[0.08] via-background to-background p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Product Details
            </p>
          </div>

          <div className="p-4 md:p-5">
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
              highlights={highlights}
            />
          </div>
        </div>
      </div>

      {/* Payment / shopping info */}
      <div className="mt-8 overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Payment & Purchase Info
          </p>
          <h2 className="mt-2 text-xl font-bold text-foreground">
            Buy with confidence
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This product supports the current Deal Bazaar checkout flow with
            secure payment options and a cleaner buying experience.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-4 md:p-6">
          <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">
              Bank Transfer
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Supported now with payment proof upload after ordering.
            </p>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">
              Card Payment
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Pay securely using supported debit or credit cards.
            </p>
          </div>

          <div className="rounded-[24px] border border-dashed border-border bg-muted/20 p-4 opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Truck className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">
              Cash on Delivery
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Coming soon
            </p>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">
              Secure Flow
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Clean checkout, order tracking, and payment status updates.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews area */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/70 bg-muted/30 p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Write a review
            </p>
            <h2 className="mt-2 text-xl font-bold text-foreground">
              Share your feedback
            </h2>
          </div>

          <div className="p-4 md:p-5">
            <ProductReviewForm productId={productRow.id} productSlug={slug} />
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/70 bg-muted/30 p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Customer feedback
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Ratings & Reviews
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Real feedback from customers who purchased this product.
            </p>
          </div>

          <div className="p-4 md:p-5">
            <ProductReviewsList reviews={reviewList} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              You may also like
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Related Products
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Similar products you might be interested in.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:p-6">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name || "Unnamed Product"}
                price={`Rs. ${Number(item.price || 0).toLocaleString()}`}
                oldPrice={
                  item.compare_at_price
                    ? `Rs. ${Number(item.compare_at_price).toLocaleString()}`
                    : undefined
                }
                image={item.thumbnail_url || "/images/placeholder-product.jpg"}
                category={item.categories?.name || "Product"}
                description={
                  item.short_description ||
                  "Clean product presentation with a simple shopping experience."
                }
                href={`/product/${item.slug || item.id}`}
                inStock={Number(item.stock_quantity || 0) > 0}
                stockText={
                  Number(item.stock_quantity || 0) > 0
                    ? `Stock: ${Number(item.stock_quantity || 0)}`
                    : "Out of stock"
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}