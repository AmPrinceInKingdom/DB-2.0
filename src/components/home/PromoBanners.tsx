import Link from "next/link";

const promoImages = [
  {
    title: "Adventure bikes",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop",
    href: "/search?q=adventure",
  },
  {
    title: "Marine deals",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=900&auto=format&fit=crop",
    href: "/search?q=marine",
  },
  {
    title: "Off-road picks",
    image:
      "https://images.unsplash.com/photo-1517846693594-1567da72af75?q=80&w=900&auto=format&fit=crop",
    href: "/search?q=outdoor",
  },
];

export default function PromoBanners() {
  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-zinc-950 shadow-sm">
        <div className="grid gap-6 px-5 py-7 text-white sm:px-6 sm:py-8 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-10">
          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur sm:text-xs">
                Special campaign
              </span>

              <h3 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                Fuel new adventures with 10% off
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300 sm:text-base">
                Browse powerful lifestyle picks, outdoor essentials, and standout
                products in a cleaner promo section that grabs attention fast.
              </p>

              <div className="mt-6">
                <Link
                  href="/search?q=adventure"
                  className="relative z-10 inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold !text-zinc-950 transition hover:bg-zinc-100"
                >
                  <span className="whitespace-nowrap !text-zinc-950">
                    Explore deals
                  </span>
                </Link>
              </div>
            </div>

            <p className="mt-8 text-xs font-medium text-zinc-400 underline-offset-4 sm:text-sm">
              Ends soon. Max discount applies to selected items only.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {promoImages.map((item) => (
              <Link key={item.title} href={item.href} className="group block">
                <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg">
                  <div className="aspect-[0.78/1] overflow-hidden">
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