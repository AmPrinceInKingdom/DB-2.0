import SectionShell from "@/components/shared/SectionShell";

/**
 * Trust section for the homepage.
 * Built to reassure customers with a cleaner and more premium layout.
 */
export default function TrustSection() {
  const items = [
    {
      title: "Secure checkout",
      description: "Clean payment, shipping, and order flow designed for safer purchases.",
      tag: "Protected",
    },
    {
      title: "Verified reviews",
      description: "Customer feedback and ratings help shoppers buy with more confidence.",
      tag: "Trusted",
    },
    {
      title: "Seller support",
      description: "Sellers can manage products, orders, and store activity more easily.",
      tag: "Managed",
    },
    {
      title: "Admin control",
      description: "Platform tools help keep products, payments, and settings under control.",
      tag: "Organized",
    },
  ];

  return (
    <SectionShell
      title="Why customers trust Deal Bazaar"
      subtitle="Show reliability early with a cleaner trust section that supports better shopping decisions."
    >
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-sm">
        {/* Top intro row */}
        <div className="grid gap-4 border-b border-border/70 bg-gradient-to-r from-background via-background to-primary/[0.05] px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
              Shop with confidence
            </span>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-foreground sm:text-3xl">
              Strong trust signals make shopping easier
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              A better homepage should not only show products fast, but also
              make customers feel safe, supported, and confident enough to keep
              browsing and buy.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-sm">
              <p className="text-lg font-black text-foreground">Safe</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                Cleaner buying flow
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-sm">
              <p className="text-lg font-black text-foreground">Simple</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                Easy product discovery
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-sm">
              <p className="text-lg font-black text-foreground">Reliable</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                Better shopping confidence
              </p>
            </div>
          </div>
        </div>

        {/* Trust cards */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-background p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent opacity-100" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background/90 text-sm font-black text-foreground shadow-sm transition group-hover:border-primary/30 group-hover:text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="mt-6 text-lg font-black tracking-[-0.02em] text-foreground">
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
      </div>
    </SectionShell>
  );
}