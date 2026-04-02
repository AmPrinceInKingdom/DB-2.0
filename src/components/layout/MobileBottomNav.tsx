"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingCart, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <div className="mx-auto max-w-lg rounded-[28px] border border-zinc-200 bg-white/95 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="grid grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;

            // Keep the active state flexible for nested account routes.
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 py-3 text-xs"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    active
                      ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`text-[11px] transition ${
                    active
                      ? "font-semibold text-red-600 dark:text-red-400"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}