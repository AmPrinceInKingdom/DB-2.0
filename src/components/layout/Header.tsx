import Link from "next/link";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { getPublicSiteConfig } from "@/lib/site-config";

/**
 * Global site header.
 * This is still a simple version for the redesign foundation phase.
 * We keep it clean, responsive, and ready for future improvements.
 */
export default async function Header() {
  const config = await getPublicSiteConfig();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="db-container">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          {/* Brand / Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.siteName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">
                DB
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold uppercase tracking-[0.14em] text-foreground">
                {config.siteName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {config.siteTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="db-button db-button-outline h-10 px-4 text-sm"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="db-button db-button-outline h-10 px-4 text-sm"
              >
                Shop
              </Link>

              <Link
                href="/wishlist"
                className="db-button db-button-outline h-10 px-4 text-sm"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="db-button db-button-outline h-10 px-4 text-sm"
              >
                Cart
              </Link>

              <Link
                href="/account"
                className="db-button db-button-outline h-10 px-4 text-sm"
              >
                Account
              </Link>
            </nav>

            <ThemeToggle />
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}