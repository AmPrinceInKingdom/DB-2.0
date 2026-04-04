"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Scale, ShoppingCart, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useCompareStore } from "@/stores/compare-store";

type ProductCardProps = {
  id: number | string;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
  href?: string;
  badge?: string;
  inStock?: boolean;
  stockText?: string;
  description?: string;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
};

function parseNumericValue(value?: string) {
  if (!value) return null;
  const numeric = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function getDiscountLabel(price?: string, oldPrice?: string) {
  const current = parseNumericValue(price);
  const previous = parseNumericValue(oldPrice);

  if (!current || !previous || previous <= current) return null;

  const percentage = Math.round(((previous - current) / previous) * 100);

  if (!Number.isFinite(percentage) || percentage <= 0) return null;

  return `-${percentage}%`;
}

export default function ProductCard({
  id,
  name,
  price,
  oldPrice,
  image,
  category = "Featured Product",
  rating = 4.8,
  reviews = 120,
  href,
  badge,
  inStock = true,
  stockText,
  description,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const addItem = useCompareStore((state) => state.addItem);
  const removeItem = useCompareStore((state) => state.removeItem);
  const isInCompare = useCompareStore((state) => state.isInCompare);

  const numericId = Number(id);
  const inCompare = Number.isFinite(numericId) ? isInCompare(numericId) : false;

  const productHref = href ?? `/product/${id}`;
  const availabilityText =
    stockText ?? (inStock ? "Ready to order" : "Out of stock");
  const finalImage =
    !image || imageError ? "/images/placeholder-product.jpg" : image;

  const finalBadge = useMemo(() => {
    if (badge) return badge;
    return getDiscountLabel(price, oldPrice);
  }, [badge, price, oldPrice]);

  function handleCompareToggle() {
    if (!Number.isFinite(numericId)) return;

    if (inCompare) {
      removeItem(numericId);
      return;
    }

    addItem({
      id: numericId,
      slug: String(href ? href.split("/").pop() || id : id),
      name,
      category,
      price,
      oldPrice,
      image: finalImage,
      description,
      inStock,
    });
  }

  return (
    <article className="group overflow-hidden rounded-[1.4rem] border border-border/70 bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
      {/* Product image area */}
      <div className="relative">
        <Link
          href={productHref}
          className="relative block aspect-[1/1] overflow-hidden bg-muted"
        >
          <Image
            src={finalImage}
            alt={name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 34vw, 18vw"
            priority={false}
            onError={() => setImageError(true)}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />
        </Link>

        {/* Top left badge */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {finalBadge ? (
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
              {finalBadge}
            </span>
          ) : null}
        </div>

        {/* Top right actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label={`Add ${name} to wishlist`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${
              isWishlisted
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-white/80 bg-white/90 text-zinc-700 hover:bg-white dark:border-zinc-700 dark:bg-black/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={handleCompareToggle}
            aria-label={`Compare ${name}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${
              inCompare
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-white/80 bg-white/90 text-zinc-700 hover:bg-white dark:border-zinc-700 dark:bg-black/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
            }`}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product content */}
      <div className="space-y-3 p-3.5 sm:p-4">
        <div className="space-y-2">
          <p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {category}
          </p>

          <Link href={productHref} className="block">
            <h3 className="line-clamp-2 min-h-[2.9rem] text-[14px] font-semibold leading-6 text-foreground transition group-hover:text-primary sm:text-[15px]">
              {name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span className="font-semibold text-foreground">
                {rating.toFixed(1)}
              </span>
            </div>
            <span>•</span>
            <span>{reviews} reviews</span>
          </div>

          {description ? (
            <p className="line-clamp-2 text-xs leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {/* Price + action row */}
        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                {price}
              </span>

              {oldPrice ? (
                <span className="text-xs text-muted-foreground line-through opacity-80 sm:text-sm">
                  {oldPrice}
                </span>
              ) : null}
            </div>

            <p
              className={`text-[11px] font-medium ${
                inStock ? "text-muted-foreground" : "text-red-500 dark:text-red-400"
              }`}
            >
              {oldPrice && inStock ? "Limited time deal" : availabilityText}
            </p>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={!inStock}
            aria-label={`Add ${name} to cart`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:scale-[1.03] hover:opacity-90 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </article>
  );
}