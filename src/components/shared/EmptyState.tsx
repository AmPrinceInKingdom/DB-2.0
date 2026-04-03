import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
};

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm md:px-10 md:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-2xl shadow-sm">
        📦
      </div>

      <h2 className="mt-5 text-2xl font-bold text-zinc-900">{title}</h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-500 md:text-base">
        {description}
      </p>

      <div className="mt-6">
        <Link
          href={buttonHref}
          className="inline-flex items-center justify-center rounded-2xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-red-800"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}