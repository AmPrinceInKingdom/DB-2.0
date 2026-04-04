"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Package,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-sm font-bold text-white">
            DB
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Deal Bazaar
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Account center
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    active
                      ? "bg-white text-red-600 dark:bg-zinc-950 dark:text-red-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                {item.label}
              </span>

              {active ? (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-600 dark:bg-red-400" />
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Settings className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Clean account control
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Access profile, orders, and saved details with a simpler layout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}