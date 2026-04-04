import Link from "next/link";
import { CreditCard, Landmark, ShoppingBag, Truck } from "lucide-react";
import { getCart } from "@/lib/cart/getCart";
import CartQuantityForm from "@/components/cart/CartQuantityForm";
import RemoveCartItemButton from "@/components/cart/RemoveCartItemButton";

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

export default async function CartPage() {
  const cart = (await getCart()) as CartRow | null;
  const items = cart?.cart_items ?? [];

  const subtotal = items.reduce((sum: number, item: CartItemRow) => {
    return sum + Number(item.products?.price || 0) * Number(item.quantity || 1);
  }, 0);

  const totalUnits = items.reduce((sum: number, item: CartItemRow) => {
    return sum + Number(item.quantity || 1);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Shopping cart
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
                My Cart
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Review your selected products before checkout.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <ShoppingBag className="h-4 w-4" />
              {totalUnits} item{totalUnits === 1 ? "" : "s"} in cart
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
            🛒
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add products to your cart and come back here to continue checkout.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item: CartItemRow) => {
              const price = Number(item.products?.price || 0);
              const quantity = Number(item.quantity || 1);
              const lineTotal = price * quantity;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-sm"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-muted">
                      <img
                        src={
                          item.products?.thumbnail_url ||
                          "/images/placeholder-product.jpg"
                        }
                        alt={item.products?.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-foreground">
                            {item.products?.name || "Unnamed product"}
                          </h2>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Price per item: Rs. {price.toLocaleString()}
                          </p>

                          <p className="mt-2 text-base font-bold text-foreground">
                            Line Total: Rs. {lineTotal.toLocaleString()}
                          </p>
                        </div>

                        <div className="w-full md:w-auto">
                          <RemoveCartItemButton cartItemId={item.id} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <CartQuantityForm
                          cartItemId={item.id}
                          initialQuantity={quantity}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
              <div className="border-b border-border/70 bg-muted/30 p-6">
                <h2 className="text-lg font-bold text-foreground">
                  Cart Summary
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A quick overview of your current cart before checkout.
                </p>
              </div>

              <div className="p-6">
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

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                    <span>Total</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="mt-6 rounded-[24px] border border-border/70 bg-muted/20 p-4">
                  <p className="text-sm font-bold text-foreground">
                    Available Payment Methods
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Landmark className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Bank Transfer
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Upload payment details after checkout
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Card Payment
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pay securely using your debit or credit card
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-3 opacity-80">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Truck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/search"
                  className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Continue Browsing
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}