import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import MarkNotificationReadButton from "@/components/account/MarkNotificationReadButton";
import MarkAllNotificationsReadButton from "@/components/account/MarkAllNotificationsReadButton";

export default async function NotificationsPage() {
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Do not render the page content for guests.
  if (!user) {
    return null;
  }

  // Load user notifications, newest first.
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = notifications ?? [];
  const unreadCount = list.filter((n: any) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Account updates
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.
              Stay updated with orders, shipping, payments, and other account
              activity.
            </p>
          </div>

          <MarkAllNotificationsReadButton />
        </div>
      </div>

      {/* Empty state */}
      {!list.length ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <Bell className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No notifications yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            New updates about your orders and account activity will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((n: any) => (
            <div
              key={n.id}
              className={`overflow-hidden rounded-[30px] border shadow-sm transition ${
                n.is_read
                  ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  : "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"
              }`}
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-bold text-zinc-900 dark:text-white">
                        {n.title}
                      </p>

                      {!n.is_read ? (
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                          New
                        </span>
                      ) : null}
                    </div>

                    {n.message ? (
                      <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                        {n.message}
                      </p>
                    ) : null}

                    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(n.created_at).toLocaleString()}
                    </p>

                    {n.link ? (
                      <a
                        href={n.link}
                        className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        Open
                      </a>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    <MarkNotificationReadButton
                      notificationId={n.id}
                      isRead={Boolean(n.is_read)}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom helper bar */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                {n.is_read
                  ? "This notification has already been marked as read."
                  : "You can open this update or mark it as read from here."}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}