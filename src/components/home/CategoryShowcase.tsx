import Link from "next/link";

const items = [
  {
    title: "Laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop",
    category: "Electronics",
  },
  {
    title: "Computer parts",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop",
    category: "Electronics",
  },
  {
    title: "Smartphones",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
    category: "Phones",
  },
  {
    title: "PC Gaming",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600&auto=format&fit=crop",
    category: "Gaming",
  },
  {
    title: "Tablets",
    image:
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop",
    category: "Electronics",
  },
  {
    title: "Storage",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop",
    category: "Accessories",
  },
  {
    title: "Cameras",
    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=600&auto=format&fit=crop",
    category: "Electronics",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="db-container pt-5 md:pt-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            The future in your hands
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore popular tech categories quickly
          </p>
        </div>

        <Link
          href="/search"
          className="text-sm font-semibold text-primary transition hover:opacity-80"
        >
          See all
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 md:gap-4">
        {items.map((item) => (
          <Link
            key={item.title}
            href={`/search?category=${encodeURIComponent(item.category)}`}
            className="group min-w-[140px] max-w-[140px] shrink-0 sm:min-w-[150px] sm:max-w-[150px] md:min-w-[160px] md:max-w-[160px] lg:min-w-[170px] lg:max-w-[170px]"
          >
            <div className="overflow-hidden rounded-[1.25rem] border border-border/70 bg-background shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
              <div className="aspect-[1/1] overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {item.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}