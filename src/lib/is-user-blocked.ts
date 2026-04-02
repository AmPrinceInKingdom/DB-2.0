import { createClient } from "@/lib/supabase/server";

export async function isUserBlocked(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("is_blocked")
    .eq("id", userId)
    .single();

  return Boolean(data?.is_blocked);
}