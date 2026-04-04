import Link from "next/link";
import {
  CreditCard,
  Landmark,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { createOrderFromCartAction } from "@/app/actions/checkout-actions";
import { createClient } from "@/lib/supabase/server";
import { getCart } from "@/lib/cart/getCart";

type CartItemRow = {
  id: string;
  quantity?: number | null;
  products?: {
    name?: string | null;
    price?: number | null;
    thumbnail_url?: string | null;
  } | null;
};

type CartRow = {
  cart_items?: CartItemRow[] | null;
};

type AddressRow = {
  recipient_name?: string | null;
  phone?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  postal_code?: string | null;
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function submitOrderAction(formData: FormData) {
    "use server";
    await createOrderFromCartAction(formData);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            Login required
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please log in before continuing to checkout.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const cart = (await getCart()) as CartRow | null;

  const { data: address } = await supabase
    .from("addresses" as never)
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .limit(1)
    .single();

  const addressRow = address as AddressRow | null;
  const items = cart?.cart_items ?? [];

  const subtotal = items.reduce((sum: number, item: CartItemRow) => {
    return sum + Number(item.products?.price || 0) * Number(item.quantity || 0);
  }, 0);

  const totalUnits = items.reduce((sum: number, item: CartItemRow) => {
    return sum + Number(item.quantity || 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add products to your cart before moving to checkout.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Final step
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Confirm your address, choose a payment method, and place your order.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Address */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Delivery
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-foreground">
                    Delivery Address
                  </h2>
                </div>

                <Link
                  href="/account/addresses"
                  className="text-sm font-semibold text-primary transition hover:opacity-80"
                >
                  Manage addresses
                </Link>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {addressRow ? (
                <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-base font-bold text-foreground">
                        {addressRow.recipient_name || ""}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {addressRow.phone || ""}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {addressRow.address_line_1 || ""}
                        {addressRow.address_line_2
                          ? `, ${addressRow.address_line_2}`
                          : ""}
                        {addressRow.city ? `, ${addressRow.city}` : ""}
                        {addressRow.postal_code
                          ? `, ${addressRow.postal_code}`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
                  No saved address found. Please add a delivery address before
                  placing your order.
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Cart preview
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Items in your order
              </h2>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              {items.map((item: CartItemRow) => {
                const price = Number(item.products?.price || 0);
                const quantity = Number(item.quantity || 0);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-[24px] border border-border/70 bg-muted/20 p-4"
                  >
                    <img
                      src={
                        item.products?.thumbnail_url ||
                        "/images/placeholder-product.jpg"
                      }
                      alt={item.products?.name || "Product"}
                      className="h-20 w-20 rounded-[18px] object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold text-foreground sm:text-base">
                        {item.products?.name || "Unnamed product"}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-foreground">
                        Rs. {price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment info */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Payment
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Choose a payment method
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Bank transfer and card payment are available now. Cash on
                delivery will be added later.
              </p>
            </div>

            <div className="grid gap-4 p-5 md:p-6 md:grid-cols-3">
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Landmark className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">
                  Bank Transfer
                </p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Transfer after order placement and upload payment proof.
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
                  Pay securely using your debit or credit card.
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
            </div>
          </div>
        </div>

        {/* Summary + form */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <h2 className="text-xl font-bold text-foreground">
                Order Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Review totals and complete your payment selection below.
              </p>
            </div>

            <div className="p-5 md:p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Products</span>
                  <span>{items.length}</span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Total units</span>
                  <span>{totalUnits}</span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <form action={submitOrderAction} className="mt-6 space-y-5">
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-border/70 bg-muted/20 p-4 transition hover:border-primary/30">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      defaultChecked
                      className="mt-1"
                    />

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Bank Transfer
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Place the order and upload payment proof after transfer.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-border/70 bg-muted/20 p-4 transition hover:border-primary/30">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      className="mt-1"
                    />

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Card Payment
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Continue with secure card payment at checkout.
                      </p>
                    </div>
                  </label>

                  <div className="flex items-start gap-3 rounded-[22px] border border-dashed border-border bg-muted/20 p-4 opacity-80">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Cash on Delivery
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                  Coupon support will be re-enabled after the checkout component
                  props are aligned.
                </div>

                <button
                  type="submit"
                  disabled={!addressRow}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
                >
                  Place Order
                </button>

                {!addressRow ? (
                  <p className="text-xs leading-6 text-red-500 dark:text-red-400">
                    Add a delivery address before placing your order.
                  </p>
                ) : null}

                <Link
                  href="/cart"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Back to Cart
                </Link>
              </form>

              <div className="mt-5 rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <PackageCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Order flow
                    </p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Place your order first, then complete the selected payment
                      method based on your choice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}