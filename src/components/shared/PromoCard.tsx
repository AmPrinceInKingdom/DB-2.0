import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PromoCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  dark?: boolean;
};

export default function PromoCard({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  dark = false,
}: PromoCardProps) {
  if (dark) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-900 shadow-sm dark:border-zinc-800">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.28),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_30%)] px-5 py-8 text-white sm:px-7 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
            {eyebrow}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-300">
            {description}
          </p>

          <Link
            href={primaryHref}
            className="mt-6 inline-flex items-center text-sm font-semibold text-white transition hover:text-red-300"
          >
            {primaryLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="bg-gradient-to-br from-white via-red-50 to-zinc-100 px-5 py-8 dark:from-zinc-950 dark:via-red-950/20 dark:to-zinc-900 sm:px-7 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          {eyebrow}
        </p>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          {title}
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {primaryLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}