/**
 * Brand strip section.
 * Gives the homepage a polished ending with simple trust and platform highlights.
 */
export default function BrandStrip() {
  const items = [
    {
      title: "Trusted Checkout",
      description: "Cleaner payment and order experience",
    },
    {
      title: "Verified Reviews",
      description: "More confidence before buying",
    },
    {
      title: "Seller Friendly",
      description: "Built for smoother store management",
    },
    {
      title: "Admin Ready",
      description: "Control products, orders, and settings",
    },
    {
      title: "Mobile First",
      description: "Designed for phones and desktop screens",
    },
  ];

  return (
    <section className="w-full pb-8 md:pb-10">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-sm">
        <div className="border-b border-border/70 bg-gradient-to-r from-background via-background to-primary/[0.05] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
                Deal Bazaar Highlights
              </span>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">
                A cleaner shopping experience from top to bottom
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Finish the homepage with simple platform highlights that help
                the store feel more polished, balanced, and trustworthy.
              </p>
            </div>

            <div className="rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground">
              Designed for growth
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-5 lg:p-8">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-background p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent opacity-100" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background/90 text-sm font-black text-foreground shadow-sm transition group-hover:border-primary/30 group-hover:text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Core
                  </span>
                </div>

                <h4 className="mt-5 text-base font-black tracking-[-0.02em] text-foreground">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}