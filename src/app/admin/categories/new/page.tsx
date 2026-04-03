import { FolderPlus } from "lucide-react";
import AddCategoryForm from "@/components/admin/AddCategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <FolderPlus className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Category creation
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Add New Category
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Create a new product category to organize storefront browsing and
              improve product filtering.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Category form
          </p>

          <h2 className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
            Category Details
          </h2>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Add category name, slug, visibility, and sorting order.
          </p>
        </div>

        <AddCategoryForm />
      </div>
    </div>
  );
}