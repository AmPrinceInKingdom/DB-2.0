import Link from "next/link";
import { FolderTree, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  // Load all categories from newest to oldest.
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  const list = categories ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Category control
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Categories
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Manage product categories, category status, and storefront organization.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <FolderTree className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No categories yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add a category to organize products more clearly across the store.
          </p>

          <Link
            href="/admin/categories/new"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Add Category
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((cat: any) => (
            <div
              key={cat.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[1fr_240px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {cat.name}
                      </h2>

                      {cat.is_active ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Slug
                        </p>
                        <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                          {cat.slug}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Status
                        </p>
                        <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                          {cat.is_active ? "Visible in store" : "Hidden"}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Created
                        </p>
                        <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                          {cat.created_at
                            ? new Date(cat.created_at).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 xl:w-auto">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
                    >
                      Edit
                    </Link>

                    <DeleteCategoryButton categoryId={cat.id} />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                Use categories to keep storefront browsing clean and structured.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}