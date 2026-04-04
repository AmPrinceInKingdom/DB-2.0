import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  Heart,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  UserCircle2,
} from "lucide-react";
import { getProfile } from "@/lib/auth/get-profile";
import LogoutButton from "@/components/auth/LogoutButton";

type AccountProfile = {
  full_name: string | null;
  email: string | null;
  role: string | null;
  phone: string | null;
};

export default async function AccountPage() {
  const profileData = await getProfile();

  if (!profileData) {
    redirect("/login");
  }

  const profile = profileData as AccountProfile;

  const isAdmin = profile.role === "admin";
  const isSeller = profile.role === "seller";

  const displayName = profile.full_name || "User";
  const displayRole = profile.role || "user";
  const initials =
    profile.full_name?.trim()?.[0]?.toUpperCase() ||
    profile.email?.trim()?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Hero header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-black text-primary">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Account Center
                </p>

                <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
                  Welcome back, {displayName}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  Manage your profile, orders, wishlist, notifications,
                  addresses, and account preferences from one clean dashboard.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {displayRole}
                  </span>

                  <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {profile.email || "No email added"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/account/profile"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                Profile Settings
              </Link>

              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Stats / quick summary */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Account role
          </p>
          <p className="mt-2 text-lg font-bold capitalize text-foreground">
            {displayRole}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your access and dashboard tools depend on this role.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Contact email
          </p>
          <p className="mt-2 line-clamp-1 text-lg font-bold text-foreground">
            {profile.email || "-"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Used for login, updates, and order communication.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Phone number
          </p>
          <p className="mt-2 text-lg font-bold text-foreground">
            {profile.phone || "-"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Helpful for delivery and order-related contact.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Left side */}
        <div className="space-y-6">
          {/* Personal info */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Account details
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Personal Information
              </h2>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Name
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {profile.full_name || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="mt-2 break-words text-base font-semibold text-foreground">
                  {profile.email || "-"}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Role
                </p>
                <p className="mt-2 text-base font-semibold capitalize text-foreground">
                  {displayRole}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Phone
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {profile.phone || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Quick actions
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Jump to important sections
              </h2>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
              <Link
                href="/orders"
                className="rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  My Orders
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Track current and previous orders.
                </p>
              </Link>

              <Link
                href="/account/addresses"
                className="rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Addresses
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Manage shipping and delivery addresses.
                </p>
              </Link>

              <Link
                href="/account/wishlist"
                className="rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Wishlist
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Save products for later.
                </p>
              </Link>

              <Link
                href="/account/notifications"
                className="rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Notifications
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Check updates about orders and payments.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Role dashboards */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Dashboards
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Access your role-based tools
              </h2>
            </div>

            <div className="space-y-4 p-5 md:p-6">
              <Link
                href="/account/profile"
                className="flex items-start gap-4 rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Profile & Settings
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Update your account details and preferences.
                  </p>
                </div>
              </Link>

              {isSeller ? (
                <Link
                  href="/seller"
                  className="flex items-start gap-4 rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Seller Dashboard
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Manage products, seller orders, and earnings.
                    </p>
                  </div>
                </Link>
              ) : null}

              {isAdmin ? (
                <Link
                  href="/admin"
                  className="flex items-start gap-4 rounded-[24px] border border-border/70 bg-muted/20 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Admin Dashboard
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Manage products, users, settings, coupons, and orders.
                    </p>
                  </div>
                </Link>
              ) : null}

              {!isSeller && !isAdmin ? (
                <div className="rounded-[24px] border border-dashed border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
                  You are currently using a customer account. Seller and admin
                  tools will appear here if your role changes later.
                </div>
              ) : null}
            </div>
          </div>

          {/* Profile card */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCircle2 className="h-8 w-8" />
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-bold text-foreground">
                    {displayName}
                  </p>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {profile.email || "-"}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                      {displayRole}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Account status
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your profile is connected and ready to use across customer,
                  seller, or admin sections depending on your assigned role.
                </p>
              </div>

              <div className="mt-5">
                <Link
                  href="/account/profile"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Open Profile Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Help / support */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="p-5 md:p-6">
              <h2 className="text-lg font-bold text-foreground">
                Need help?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Use your account area to manage orders, wishlist items,
                addresses, and notifications in one place.
              </p>

              <div className="mt-4 rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Quick tip
                </p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  Bank transfer and card payment are supported in checkout.
                  Cash on delivery is coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}