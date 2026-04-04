"use client";

import Link from "next/link";
import {
  CreditCard,
  Landmark,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";

type ProductInfoProps = {
  id: string | number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  description: string;
  rating?: number;
  reviews?: number;
  sku?: string;
  highlights?: string[];
  stockQuantity?: number;
};

export default function ProductInfo({
  id,
  name,
  category,
  price,
  oldPrice,
  description,
  rating = 4.8,
  reviews = 120,
  sku = "DB-001",
  highlights = [],
  stockQuantity = 0,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const inStock = stockQuantity > 0;

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => {
      if (!inStock) return 1;
      if (stockQuantity > 0) {
        return prev < stockQuantity ? prev + 1 : prev;
      }
      return prev + 1;
    });
  };

  const priceLabel = useMemo(() => {
    return oldPrice ? "Limited deal" : "Ready to order";
  }, [oldPrice]);

  const finalHighlights =
    highlights.length > 0
      ? highlights
      : [
          "Bank transfer supported",
          "Card payment available",
          "Cash on delivery coming soon",
          "Secure checkout process",
        ];

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Category + rating */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {category}
            </span>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium text-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>

              <span>•</span>
              <span>{reviews} reviews</span>
            </div>
          </div>

          {/* title */}
          <h1 className="mt-4 text-[28px] font-black tracking-tight text-foreground sm:text-[34px]">
            {name}
          </h1>

          {/* description */}
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-[15px]">
            {description}
          </p>

          {/* price */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-[34px] font-black tracking-tight text-foreground">
              {price}
            </span>

            {oldPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {oldPrice}
              </span>
            )}

            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {priceLabel}
            </span>
          </div>

          {/* sku + stock */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Product code
              </p>
              <p className="mt-1.5 text-sm font-semibold text-foreground">
                {sku}
              </p>
            </div>

            <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Availability
              </p>
              <p
                className={`mt-1.5 text-sm font-semibold ${
                  inStock ? "text-green-600" : "text-red-500"
                }`}
              >
                {inStock ? `In stock (${stockQuantity})` : "Out of stock"}
              </p>
            </div>
          </div>

          {/* highlights */}
          <div className="mt-6 rounded-[24px] border border-border/70 bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              Product highlights
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {finalHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/60 bg-background px-3 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* payment methods */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/20 p-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Landmark className="h-4 w-4" />
                Bank Transfer
              </div>
              <p className="mt-1 text-muted-foreground">
                Upload slip after order
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <CreditCard className="h-4 w-4" />
                Card Payment
              </div>
              <p className="mt-1 text-muted-foreground">
                Secure checkout supported
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs opacity-70">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Truck className="h-4 w-4" />
                Cash on Delivery
              </div>
              <p className="mt-1 text-muted-foreground">
                Coming soon
              </p>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="border-t border-border bg-muted/30 p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center rounded-full border border-border bg-background p-1">
                <button
                  onClick={decreaseQuantity}
                  className="h-10 w-10 rounded-full hover:bg-muted"
                >
                  <Minus className="h-4 w-4 mx-auto" />
                </button>

                <span className="min-w-[48px] text-center font-bold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={!inStock}
                  className="h-10 w-10 rounded-full hover:bg-muted disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mx-auto" />
                </button>
              </div>

              <WishlistButton productId={String(id)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                productId={String(id)}
                quantity={quantity}
                disabled={!inStock}
              />

              <Link
                href="/checkout"
                className={`inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-white ${
                  inStock
                    ? "bg-primary hover:opacity-90"
                    : "bg-muted text-muted-foreground pointer-events-none"
                }`}
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* trust cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-border/70 bg-background p-4">
          <Truck className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-semibold">Fast delivery</p>
          <p className="text-xs text-muted-foreground">
            Clean ordering flow with reliable delivery support.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background p-4">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-semibold">Secure shopping</p>
          <p className="text-xs text-muted-foreground">
            Safe and transparent checkout experience.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background p-4">
          <RotateCcw className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-semibold">Easy returns</p>
          <p className="text-xs text-muted-foreground">
            Simple and friendly return support.
          </p>
        </div>
      </div>
    </div>
  );
}