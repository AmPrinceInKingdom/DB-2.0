import Link from "next/link";
import {
  Heart,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";

const stats = [
  {
    title: "Orders",
    value: "12",
    description: "Track your recent and completed orders.",
    icon: Package,
    href: "/orders",
  },
  {
    title: "Wishlist",
    value: "8",
    description: "Saved products ready to revisit anytime.",
    icon: Heart,
    href: "/account/wishlist",
  },
  {
    title: "Addresses",
    value: "2",
    description: "Manage delivery locations for faster checkout.",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    title: "Profile",
    value: "Ready",
    description: "Keep your personal account details updated.",
    icon: User,
    href: "/account/profile",
  },
];

const recentOrders = [
  {
    orderNumber: "DB-10245",
    date: "2026-03-25",
    status: "Delivered",
    total: "Rs 24,500",
  },
  {
    orderNumber: "DB-10231",
    date: "2026-03-22",
    status: "Processing",
    total: "Rs 15,200",
  },
  {
    orderNumber: "DB-10198",
    date: "2026-03-18",
    status: "Shipped",
    total: "Rs 39,500",
  },
];

export default function AccountDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Welcome back
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Manage everything in one clean place
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              View orders, update profile details, manage addresses, and keep
              your shopping experience simple and organized.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <ShoppingBag className="mr-2 h-4.5 w-4.5" />
            Continue shopping
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  {item.title}
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Recent orders
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Your latest activity
              </h3>
            </div>

            <Link
              href="/orders"
              className="text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              View all orders
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.orderNumber}
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Date: {order.date}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                          : order.status === "Processing"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {order.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Quick actions
            </p>

            <div className="mt-4 space-y-3">
              <Link
                href="/account/profile"
                className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <span>Edit profile</span>
                <span>→</span>
              </Link>

              <Link
                href="/account/addresses"
                className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <span>Manage addresses</span>
                <span>→</span>
              </Link>

              <Link
                href="/account/wishlist"
                className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <span>Open wishlist</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-dashed border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Cleaner account experience
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              This dashboard is redesigned to feel lighter, easier to scan, and
              more comfortable on mobile and desktop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}