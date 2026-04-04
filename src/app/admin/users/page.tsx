import { Search, ShieldCheck, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import UserRoleForm from "@/components/admin/UserRoleForm";
import BlockUserButton from "@/components/admin/BlockUserButton";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  // Build the user query.
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (q.trim()) {
    const term = q.trim();
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: users } = await query;
  const list = users ?? [];

  function getRoleClasses(role: string) {
    if (role === "admin") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (role === "seller") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              User control
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Manage Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Change roles, search accounts, and control user access across the
              platform.
            </p>
          </div>

          {/* Search form */}
          <form action="/admin/users" className="flex gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search by name or email"
                className="h-11 w-full rounded-full border border-zinc-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Empty state */}
      {!list.length ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <Users className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No users found
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Try a different search term to find the user you want.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((profile: any) => (
            <div
              key={profile.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr_1fr]">
                  {/* Left side: user identity */}
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-400">
                        {profile.full_name?.[0]?.toUpperCase() ||
                          profile.email?.[0]?.toUpperCase() ||
                          "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">
                          {profile.full_name || "No name"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {profile.email}
                        </p>

                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                          User ID: {profile.id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleClasses(
                          profile.role || "customer"
                        )}`}
                      >
                        {profile.role || "customer"}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          profile.is_blocked
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        }`}
                      >
                        {profile.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Middle: role management */}
                  <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Role Management
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Assign admin, seller, or customer access.
                    </p>

                    <div className="mt-4">
                      <UserRoleForm
                        userId={profile.id}
                        currentRole={profile.role || "customer"}
                      />
                    </div>
                  </div>

                  {/* Right: access control */}
                  <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        Access Control
                      </p>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      Block or re-enable account activity.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            profile.is_blocked
                              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                              : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          }`}
                        >
                          {profile.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </div>

                      <BlockUserButton
                        userId={profile.id}
                        isBlocked={Boolean(profile.is_blocked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom helper bar */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                Use this page to control roles and prevent blocked accounts from
                accessing platform actions.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}