import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCart } from "@/lib/cart/getCart";
import CartQuantityForm from "@/components/cart/CartQuantityForm";
import RemoveCartItemButton from "@/components/cart/RemoveCartItemButton";

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.cart_items ?? [];

  // Calculate subtotal using current product prices and cart quantities.
  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + Number(item.products?.price || 0) * Number(item.quantity || 1);
  }, 0);

  // Calculate total quantity across all cart items.
  const totalUnits = items.reduce((sum: number, item: any) => {
    return sum + Number(item.quantity || 1);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Shopping cart
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              My Cart
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Review your selected products before checkout.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <ShoppingBag className="h-4 w-4" />
            {totalUnits} item{totalUnits === 1 ? "" : "s"} in cart
          </div>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-2xl dark:bg-zinc-900">
            🛒
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add products to your cart and come back here to continue checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Cart item list */}
          <div className="space-y-4">
            {items.map((item: any) => {
              const price = Number(item.products?.price || 0);
              const quantity = Number(item.quantity || 1);
              const lineTotal = price * quantity;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                    {/* Product image */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[22px] bg-zinc-100 dark:bg-zinc-900">
                      <img
                        src={
                          item.products?.thumbnail_url ||
                          "/images/placeholder-product.jpg"
                        }
                        alt={item.products?.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                            {item.products?.name || "Unnamed product"}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Price per item: Rs. {price.toLocaleString()}
                          </p>

                          <p className="mt-2 text-base font-bold text-zinc-900 dark:text-white">
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

          {/* Cart summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Cart Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                A quick overview of your current cart before moving to checkout.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Products</span>
                  <span>{items.length}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Total units</span>
                  <span>{totalUnits}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                  <span>Total</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}