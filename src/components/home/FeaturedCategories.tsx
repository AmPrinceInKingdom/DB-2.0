import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionShell from "@/components/shared/SectionShell";

type CategoryRow = {
  id: string;
  name: string;
  slug?: string | null;
};

const categoryAccents = [
  "from-primary/12 via-primary/5 to-transparent",
  "from-emerald-500/12 via-emerald-500/5 to-transparent",
  "from-blue-500/12 via-blue-500/5 to-transparent",
  "from-amber-500/12 via-amber-500/5 to-transparent",
  "from-violet-500/12 via-violet-500/5 to-transparent",
  "from-rose-500/12 via-rose-500/5 to-transparent",
  "from-cyan-500/12 via-cyan-500/5 to-transparent",
  "from-orange-500/12 via-orange-500/5 to-transparent",
];

export default async function FeaturedCategories() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories" as never)
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(8);

  const list = ((categories as CategoryRow[] | null) ?? []).filter(
    (category): category is CategoryRow =>
      Boolean(category?.id) && Boolean(category?.name)
  );

  return (
    <SectionShell
      title="Shop by Category"
      subtitle="Jump into popular sections faster and discover products with less effort."
      action={
        <Link href="/shop" className="db-button db-button-outline text-sm">
          View All Categories
        </Link>
      }
    >
      {error ? (
        <div className="db-panel p-6 text-sm text-destructive">
          Failed to load categories.
        </div>
      ) : list.length === 0 ? (
        <div className="db-panel p-6 text-sm text-muted-foreground">
          No categories available yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((category, index) => {
            const accent =
              categoryAccents[index % categoryAccents.length];

            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-background p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-100 transition duration-200`}
                />

                <div className="relative z-10 flex min-h-[168px] flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-background/90 text-base font-black text-foreground shadow-sm transition group-hover:border-primary/30 group-hover:text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Explore
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-black tracking-[-0.02em] text-foreground sm:text-xl">
                      {category.name}
                    </h3>

                    <p className="mt-2 max-w-[22rem] text-sm leading-7 text-muted-foreground">
                      Browse featured items, trending picks, and product collections in this category.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      Shop now
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/90 text-base text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}