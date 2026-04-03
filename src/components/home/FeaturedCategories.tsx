import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionShell from "@/components/shared/SectionShell";

/**
 * Homepage featured categories section.
 * Uses real categories from the database and keeps the UI simple and clean.
 */
export default async function FeaturedCategories() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(8);

  const list = categories ?? [];

  return (
    <SectionShell
      title="Featured Categories"
      subtitle="Explore popular shopping sections quickly."
      action={
        <Link href="/shop" className="db-button db-button-outline text-sm">
          Browse Shop
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="db-panel group p-5 transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {category.name}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Shop products in this category
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionShell>
  );
}