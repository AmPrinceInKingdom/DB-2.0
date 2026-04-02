import ThemeToggle from "@/components/shared/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

/**
 * Account profile and settings page.
 * Theme switching is intentionally placed here instead of the header
 * so the global navigation stays clean and simple.
 */
export default async function AccountProfilePage() {
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load the matching profile data if the user exists.
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, email, role, phone")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Top heading panel */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Profile & Preferences
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Account Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Manage your personal information, review your account role, and choose
          the visual theme you want to use across Deal Bazaar.
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Left side: account information */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Personal information
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                Account Details
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  Full Name
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                  {profile?.full_name || "Not set"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  Email
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                  {profile?.email || user?.email || "Not available"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  Phone
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                  {profile?.phone || "Not set"}
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  Role
                </p>
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold capitalize text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    {profile?.role || "customer"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple account note */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Account Status
            </h2>

            <div className="mt-4 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Connected and active
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Your account is connected to the current Deal Bazaar profile
                system. Orders, wishlist, addresses, and notifications will all
                follow this account.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: appearance settings */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Appearance
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                Theme Preference
              </h2>
              <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Choose how you want Deal Bazaar to look while browsing the site.
                Your preference stays saved for later visits.
              </p>
            </div>

            <div className="mt-5">
              <ThemeToggle />
            </div>

            <div className="mt-6 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Theme guidance
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Dark mode gives a premium, softer look at night. Light mode
                keeps the interface brighter and cleaner for daytime use.
              </p>
            </div>
          </div>

          {/* Simple preferences card */}
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Preferences
            </h2>

            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Navigation preference
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Header theme switch is hidden to keep navigation simple. Theme
                  settings are managed here instead.
                </p>
              </div>

              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Account control
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  This page acts as your personal settings center while the main
                  account dashboard gives you quick access to orders, wishlist,
                  notifications, and role-based tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}