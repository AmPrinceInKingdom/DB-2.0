import Link from "next/link";
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
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Login required
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Please log in before continuing to checkout.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
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
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add products to your cart before moving to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Final step
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Confirm your address, select a payment method, and place your order.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                  Delivery
                </p>
                <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                  Delivery Address
                </h2>
              </div>

              <Link
                href="/account/addresses"
                className="text-sm font-semibold text-red-600 transition hover:text-red-700"
              >
                Manage addresses
              </Link>
            </div>

            {addressRow ? (
              <div className="mt-5 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-base font-bold text-zinc-900 dark:text-white">
                  {addressRow.recipient_name || ""}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {addressRow.phone || ""}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {addressRow.address_line_1 || ""}
                  {addressRow.address_line_2 ? `, ${addressRow.address_line_2}` : ""}
                  {addressRow.city ? `, ${addressRow.city}` : ""}
                  {addressRow.postal_code ? `, ${addressRow.postal_code}` : ""}
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                No saved address found. Please add a delivery address before
                placing your order.
              </div>
            )}
          </div>

          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Cart preview
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                Items in your order
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((item: CartItemRow) => {
                const price = Number(item.products?.price || 0);
                const quantity = Number(item.quantity || 0);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
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
                      <p className="line-clamp-2 text-sm font-bold text-zinc-900 dark:text-white sm:text-base">
                        {item.products?.name || "Unnamed product"}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                        Rs. {price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Payment
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Choose a payment method
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              You can continue with cash on delivery or bank transfer based on
              your order preference.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Order Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Review totals and complete your payment selection below.
            </p>

            <div className="mt-5 space-y-3 text-sm">
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

              <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <form action={submitOrderAction} className="mt-6 space-y-5">
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 transition hover:border-red-300 dark:border-zinc-800 dark:bg-zinc-900">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    defaultChecked
                    className="mt-1"
                  />

                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Cash on Delivery
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 transition hover:border-red-300 dark:border-zinc-800 dark:bg-zinc-900">
                  <input
                    type="radio"
                    name="payment_method"
                    value="bank_transfer"
                    className="mt-1"
                  />

                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Bank Transfer
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Place the order and upload payment proof after transfer.
                    </p>
                  </div>
                </label>
              </div>

              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                Coupon support will be re-enabled after the checkout component
                props are aligned.
              </div>

              <button
                type="submit"
                disabled={!addressRow}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
              >
                Place Order
              </button>

              {!addressRow ? (
                <p className="text-xs leading-6 text-red-500 dark:text-red-400">
                  Add a delivery address before placing your order.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
