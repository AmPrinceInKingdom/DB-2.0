import { createClient } from "@/lib/supabase/server";

type NotificationInsert = {
  user_id: string;
  title: string;
  message?: string | null;
  link?: string | null;
};

export async function createNotification({
  userId,
  title,
  message,
  link,
}: {
  userId: string;
  title: string;
  message?: string;
  link?: string;
}) {
  const supabase = await createClient();

  const payload: NotificationInsert = {
    user_id: userId,
    title,
    message: message ?? null,
    link: link ?? null,
  };

  await supabase
    .from("notifications" as never)
    .insert(payload as never);
}
