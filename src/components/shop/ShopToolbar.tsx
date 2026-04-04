type ShopToolbarProps = {
  totalProducts: number;
};

export default function ShopToolbar({ totalProducts }: ShopToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          Shop
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {totalProducts} product{totalProducts === 1 ? "" : "s"} available
        </p>
      </div>

      <select className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
        <option>Newest</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  );
}