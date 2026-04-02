import { createClient } from "@/lib/supabase/server";

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

  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    link,
  });
}