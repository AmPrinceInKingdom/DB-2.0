import Link from "next/link";
import { CheckCircle2, CreditCard, Landmark, PackageCheck } from "lucide-react";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-[-0.03em] text-foreground">
            Order placed successfully
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Thank you for shopping with Deal Bazaar. Your order has been placed
            successfully and is now waiting for the next step.
          </p>

          {order ? (
            <div className="mt-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Order Number: {order}
            </div>
          ) : null}
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PackageCheck className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">
                Order received
              </p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Your items are now saved in the order system.
              </p>
            </div>

            <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Landmark className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">
                Bank transfer
              </p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Available for payment after placing the order.
              </p>
            </div>

            <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">
                Card payment
              </p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Secure card payment flow is available at checkout.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Cash on Delivery is coming soon.
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              View Orders
            </Link>

            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}