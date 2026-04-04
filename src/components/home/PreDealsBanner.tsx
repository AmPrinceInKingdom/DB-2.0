import Link from "next/link";

const promoTiles = [
  {
    title: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
    href: "/search?q=sneakers",
  },
  {
    title: "Luxury bags",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    href: "/search?q=bags",
  },
  {
    title: "Collectibles",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop",
    href: "/search?q=collectibles",
  },
  {
    title: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=900&auto=format&fit=crop",
    href: "/search?category=Phones",
  },
];

export default function PreDealsBanner() {
  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-sm">
        {/* Top small strip */}
        <div className="flex flex-col gap-4 border-b border-border/70 bg-muted/30 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h3 className="text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">
              Shopping made easy
            </h3>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Enjoy reliability, secure deliveries, and hassle-free returns.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 lg:w-auto"
          >
            Start now
          </Link>
        </div>

        {/* Main blue banner */}
        <div className="grid gap-6 bg-[linear-gradient(135deg,#4f46e5_0%,#3b82f6_100%)] px-5 py-7 text-white sm:px-6 sm:py-8 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-10">
          <div className="flex flex-col justify-center">
            <h3 className="max-w-xl text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Browse the world. Find products faster.
            </h3>

            <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
              Discover international finds, trending categories, and cleaner
              product discovery across your favorite shopping sections.
            </p>

            <div className="mt-6">
              <Link
                href="/search"
                className="relative z-10 inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold !text-indigo-700 transition hover:bg-white/90"
              >
                <span className="whitespace-nowrap !text-indigo-700">
                  Browse now
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {promoTiles.map((item) => (
              <Link key={item.title} href={item.href} className="group block">
                <div className="overflow-hidden rounded-[1.25rem] border border-white/15 bg-white/10 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <div className="aspect-[0.72/1] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}