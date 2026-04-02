import Link from "next/link";
import { getPublicSiteConfig } from "@/lib/site-config";

/**
 * Homepage hero section.
 * Clean, simple, mobile-friendly, and brand focused.
 */
export default async function HeroSection() {
  const config = await getPublicSiteConfig();

  return (
    <section className="db-container py-6 md:py-10">
      <div className="db-panel overflow-hidden p-6 md:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="db-badge db-badge-primary">
              Smart Shopping Experience
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.03em] text-foreground md:text-5xl lg:text-6xl">
              Shop smarter with {config.siteName}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Discover trusted products, modern deals, and a clean shopping
              experience built for customers, sellers, and admins in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="db-button db-button-primary px-5">
                Start Shopping
              </Link>

              <Link
                href="/account"
                className="db-button db-button-outline px-5"
              >
                My Account
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="db-card p-4">
                <p className="text-sm font-bold text-foreground">Fast browsing</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Smooth and simple store experience
                </p>
              </div>

              <div className="db-card p-4">
                <p className="text-sm font-bold text-foreground">Better deals</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Featured products and discount-ready checkout
                </p>
              </div>

              <div className="db-card p-4">
                <p className="text-sm font-bold text-foreground">Secure flow</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Orders, reviews, shipping, and notifications
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="db-card p-4 md:p-5">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-secondary to-transparent p-5 md:p-6">
                <div className="space-y-4">
                  <div className="db-card p-4">
                    <p className="text-sm font-bold text-foreground">
                      Trending now
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Explore curated picks, trusted sellers, and products ready
                      for your next order.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="db-card p-4">
                      <p className="text-2xl font-black text-foreground">24/7</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Store access anytime
                      </p>
                    </div>

                    <div className="db-card p-4">
                      <p className="text-2xl font-black text-foreground">
                        Clean UI
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Friendly on desktop and mobile
                      </p>
                    </div>
                  </div>

                  <div className="db-card p-4">
                    <p className="text-sm font-bold text-foreground">
                      Built for growth
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Customer shopping, seller management, and admin control —
                      all inside one scalable platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}