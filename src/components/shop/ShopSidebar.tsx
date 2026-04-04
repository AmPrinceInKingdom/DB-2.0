type ShopSidebarProps = {
  categories: string[];
};

export default function ShopSidebar({ categories }: ShopSidebarProps) {
  return (
    <aside className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Filters
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Browse products by category
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-white">
          Categories
        </h3>

        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}