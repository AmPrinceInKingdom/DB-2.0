import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { getProfile } from "@/lib/auth/get-profile";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AccountPage() {
  const profile = await getProfile();

  // Redirect guests to login before showing the account dashboard.
  if (!profile) {
    redirect("/login");
  }

  const isAdmin = profile.role === "admin";
  const isSeller = profile.role === "seller";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Top welcome panel */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Account Center
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Welcome back, {profile.full_name || "User"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Manage your profile, orders, wishlist, notifications, addresses,
              and account preferences from one clean dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/account/profile"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Profile Settings
            </Link>

            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {/* Left side */}
        <div className="space-y-6">
          {/* Basic profile cards */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Account details
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                Personal Information
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Name
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-white">
                  {profile.full_name || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Email
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-white">
                  {profile.email || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Role
                </p>
                <p className="mt-2 text-base font-semibold capitalize text-zinc-900 dark:text-white">
                  {profile.role}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Phone
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-white">
                  {profile.phone || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick access links */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Quick actions
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                Jump to important sections
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Link
                href="/orders"
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <Package className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  My Orders
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Track current and previous orders.
                </p>
              </Link>

              <Link
                href="/account/addresses"
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Addresses
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Manage shipping and delivery addresses.
                </p>
              </Link>

              <Link
                href="/account/wishlist"
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <Heart className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Wishlist
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Save products for later.
                </p>
              </Link>

              <Link
                href="/account/notifications"
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Notifications
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Check updates about orders and payments.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Dashboard access cards */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Dashboards
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                Access your role-based tools
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <Link
                href="/account/profile"
                className="flex items-start gap-4 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Profile & Settings
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    Update your account details and theme settings.
                  </p>
                </div>
              </Link>

              {isSeller ? (
                <Link
                  href="/seller"
                  className="flex items-start gap-4 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Seller Dashboard
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Manage products, seller orders, and earnings.
                    </p>
                  </div>
                </Link>
              ) : null}

              {isAdmin ? (
                <Link
                  href="/admin"
                  className="flex items-start gap-4 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Admin Dashboard
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Manage products, users, settings, coupons, and orders.
                    </p>
                  </div>
                </Link>
              ) : null}

              {!isSeller && !isAdmin ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  You are currently using a customer account. Seller and admin
                  tools will appear here if your role changes later.
                </div>
              ) : null}
            </div>
          </div>

          {/* Account overview card */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {profile.full_name?.[0]?.toUpperCase() ||
                  profile.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>

              <div className="min-w-0">
                <p className="text-lg font-bold text-zinc-900 dark:text-white">
                  {profile.full_name || "User Account"}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {profile.email || "-"}
                </p>
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold capitalize text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Account status
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Your profile is connected and ready to use across customer,
                seller, or admin sections depending on your assigned role.
              </p>
            </div>

            <div className="mt-5">
              <Link
                href="/account/profile"
                className="inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Open Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}