"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Scale, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useCompareStore } from "@/store/compare-store";

type ProductCardProps = {
  // Basic product identity
  id: number | string;
  name: string;

  // Price display values
  price: string;
  oldPrice?: string;

  // Product media
  image: string;

  // Extra product details
  category?: string;
  rating?: number;
  reviews?: number;
  href?: string;
  badge?: string;

  // Optional state flags
  inStock?: boolean;
  stockText?: string;
  description?: string;

  // Optional action handlers
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
};

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

  // Compare store actions.
  const addItem = useCompareStore((state) => state.addItem);
  const removeItem = useCompareStore((state) => state.removeItem);
  const isInCompare = useCompareStore((state) => state.isInCompare);

  const numericId = Number(id);
  const inCompare = Number.isFinite(numericId) ? isInCompare(numericId) : false;

  // Product destination fallback
  const productHref = href ?? `/product/${id}`;

  // Small helper text for stock state
  const availabilityText =
    stockText ?? (inStock ? "Ready to order" : "Out of stock");

  // Safe fallback image for broken or missing product images
  const finalImage =
    !image || imageError ? "/images/placeholder-product.jpg" : image;

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
    <div className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      {/* Product image area */}
      <div className="relative">
        <Link
          href={productHref}
          className="relative block aspect-[4/4.25] overflow-hidden bg-zinc-100 dark:bg-zinc-900"
        >
          <Image
            src={finalImage}
            alt={name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 88vw, (max-width: 768px) 45vw, (max-width: 1200px) 30vw, 22vw"
            priority={false}
            onError={() => setImageError(true)}
          />

          {/* Softer overlay in light mode, slightly richer in dark mode */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent dark:from-black/20" />
        </Link>

        {/* Discount / badge label */}
        {badge ? (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white shadow-md">
              {badge}
            </span>
          </div>
        ) : null}

        {/* Top right actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label={`Add ${name} to wishlist`}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${
              isWishlisted
                ? "border-red-500/30 bg-red-600 text-white"
                : "border-white/80 bg-white/90 text-zinc-700 hover:bg-white dark:border-zinc-700 dark:bg-black/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
            }`}
          >
            <Heart
              className={`h-[18px] w-[18px] ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={handleCompareToggle}
            aria-label={`Compare ${name}`}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${
              inCompare
                ? "border-red-500/30 bg-red-600 text-white"
                : "border-white/80 bg-white/90 text-zinc-700 hover:bg-white dark:border-zinc-700 dark:bg-black/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
            }`}
          >
            <Scale className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Product content */}
      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-2.5">
          {/* Category label */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            {category}
          </p>

          {/* Product title */}
          <Link href={productHref} className="block">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-zinc-900 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 sm:text-[17px]">
              {name}
            </h3>
          </Link>

          {/* Product rating */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                {rating.toFixed(1)}
              </span>
            </div>
            <span>•</span>
            <span>{reviews} reviews</span>
          </div>

          {/* Optional short description */}
          {description ? (
            <p className="line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>

        {/* Price + action row */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[26px] font-black tracking-tight text-zinc-900 dark:text-white">
                {price}
              </span>

              {oldPrice ? (
                <span className="text-sm text-zinc-400 line-through dark:text-zinc-500">
                  {oldPrice}
                </span>
              ) : null}
            </div>

            <p
              className={`text-xs font-medium ${
                inStock
                  ? "text-zinc-500 dark:text-zinc-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {oldPrice && inStock ? "Limited time deal" : availabilityText}
            </p>
          </div>

          {/* Add to cart action */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!inStock}
            aria-label={`Add ${name} to cart`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:scale-[1.03] hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}