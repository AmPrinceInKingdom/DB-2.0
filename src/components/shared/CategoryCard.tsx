import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type CategoryCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function CategoryCard({
  title,
  description,
  href,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <Icon className="h-5 w-5" />
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition group-hover:bg-red-50 group-hover:text-red-600 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:bg-red-950/40 dark:group-hover:text-red-400">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-zinc-900 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 sm:text-base">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400 sm:text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}