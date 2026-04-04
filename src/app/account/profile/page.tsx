import ThemeToggle from "@/components/shared/ThemeToggle";
import { createClient } from "@/lib/supabase/server";
import { Palette, ShieldCheck, UserCircle2 } from "lucide-react";

type AccountProfile = {
  full_name: string | null;
  email: string | null;
  role: string | null;
  phone: string | null;
};

/**
 * Account profile and settings page.
 * Theme switching is intentionally placed here instead of the header
 * so the global navigation stays clean and simple.
 */
export default async function AccountProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileResult = user
    ? await supabase
        .from("profiles")
        .select("full_name, email, role, phone")
        .eq("id", user.id)
        .single()
    : null;

  const profile = (profileResult?.data ?? null) as AccountProfile | null;

  const displayName = profile?.full_name || "User";
  const displayEmail = profile?.email || user?.email || "Not available";
  const displayPhone = profile?.phone || "Not set";
  const displayRole = profile?.role || "customer";
  const initials =
    profile?.full_name?.trim()?.[0]?.toUpperCase() ||
    user?.email?.trim()?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
        <div className="bg-gradient-to-r from-primary/[0.08] via-background to-background p-5 md:p-6 lg:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-black text-primary">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Profile & Preferences
                </p>

                <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">
                  Account Settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  Manage your personal information, review your account role,
                  and choose the visual theme you want to use across Deal Bazaar.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {displayRole}
                  </span>

                  <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top quick summary */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Full name
          </p>
          <p className="mt-2 text-lg font-bold text-foreground">
            {displayName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your main profile display name.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Email address
          </p>
          <p className="mt-2 break-words text-lg font-bold text-foreground">
            {displayEmail}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Used for login and account communication.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Phone number
          </p>
          <p className="mt-2 text-lg font-bold text-foreground">
            {displayPhone}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Helpful for delivery and contact updates.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Left side */}
        <div className="space-y-6">
          {/* Personal details */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Personal information
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                Account Details
              </h2>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">
              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Full Name
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {profile?.full_name || "Not set"}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Email
                </p>
                <p className="mt-2 break-words text-sm font-medium text-foreground">
                  {displayEmail}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Phone
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {displayPhone}
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Role
                </p>
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {displayRole}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account status */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <h2 className="text-xl font-bold text-foreground">
                Account Status
              </h2>
            </div>

            <div className="p-5 md:p-6">
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Connected and active
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Your account is connected to the current Deal Bazaar
                      profile system. Orders, wishlist, addresses, and
                      notifications all follow this account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Theme preference */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Palette className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Appearance
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-foreground">
                    Theme Preference
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Choose how you want Deal Bazaar to look while browsing the
                    site. Your preference stays saved for later visits.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <ThemeToggle />
              </div>

              <div className="mt-5 rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Theme guidance
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Dark mode gives a premium, softer look at night. Light mode
                  keeps the interface brighter and cleaner for daytime use.
                </p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="overflow-hidden rounded-[30px] border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 p-5 md:p-6">
              <h2 className="text-xl font-bold text-foreground">
                Preferences
              </h2>
            </div>

            <div className="space-y-3 p-5 md:p-6">
              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Navigation preference
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Header theme switch is hidden to keep navigation simple. Theme
                  settings are managed here instead.
                </p>
              </div>

              <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Account control
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This page acts as your personal settings center while the main
                  account dashboard gives you quick access to orders, wishlist,
                  notifications, and role-based tools.
                </p>
              </div>
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
                    {displayEmail}
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
                  Profile note
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your current profile information is ready to use across
                  orders, wishlist, addresses, and future account tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}