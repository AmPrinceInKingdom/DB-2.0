import type { ReactNode } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountTabs from "@/components/account/AccountTabs";

type AccountLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AccountLayout({
  title,
  description,
  children,
}: AccountLayoutProps) {
  return (
    <div className="bg-zinc-50 dark:bg-black">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mb-6 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6 lg:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Account
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mb-5 lg:hidden">
          <AccountTabs />
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <AccountSidebar />
          </div>

          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </div>
  );
}