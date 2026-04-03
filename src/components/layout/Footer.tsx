import Link from "next/link";
import { getPublicSiteConfig } from "@/lib/site-config";

/**
 * Global footer.
 * Uses public site settings so branding and support details
 * can be controlled from the admin settings page.
 */
export default async function Footer() {
  const config = await getPublicSiteConfig();

  return (
    <footer className="mt-10 border-t border-border bg-card">
      <div className="db-container py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.siteName}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">
                  DB
                </div>
              )}

              <div>
                <h3 className="text-lg font-extrabold uppercase tracking-[0.12em] text-foreground">
                  {config.siteName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {config.siteTagline}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              A clean and modern shopping experience for customers, sellers,
              and admins — all in one place.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
              Quick Links
            </h4>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <Link href="/" className="block transition hover:text-foreground">
                Home
              </Link>
              <Link
                href="/shop"
                className="block transition hover:text-foreground"
              >
                Shop
              </Link>
              <Link
                href="/wishlist"
                className="block transition hover:text-foreground"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                className="block transition hover:text-foreground"
              >
                Cart
              </Link>
              <Link
                href="/account"
                className="block transition hover:text-foreground"
              >
                Account
              </Link>
            </div>
          </div>

          {/* Support info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
              Support
            </h4>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {config.supportEmail ? (
                <p>Email: {config.supportEmail}</p>
              ) : (
                <p>Email support will be added soon.</p>
              )}

              {config.supportPhone ? (
                <p>Phone: {config.supportPhone}</p>
              ) : (
                <p>Phone support details will be added soon.</p>
              )}

              <p>Currency: {config.currencyCode}</p>
            </div>
          </div>

          {/* Store details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
              Store Info
            </h4>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>
                Shipping Fee: {config.currencySymbol}{" "}
                {config.shippingFee.toLocaleString()}
              </p>

              <p>
                Free Shipping Above: {config.currencySymbol}{" "}
                {config.freeShippingThreshold.toLocaleString()}
              </p>

              <p>Fast, simple, and mobile-friendly shopping flow.</p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {config.siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/shop" className="transition hover:text-foreground">
              Browse Products
            </Link>
            <Link href="/orders" className="transition hover:text-foreground">
              Orders
            </Link>
            <Link href="/account" className="transition hover:text-foreground">
              My Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}