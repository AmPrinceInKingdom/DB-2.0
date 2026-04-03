import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  is_blocked: boolean | null;
};

export async function isUserBlocked(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles" as never)
    .select("is_blocked")
    .eq("id", userId)
    .single();

  const profile = data as ProfileRow | null;

  return Boolean(profile?.is_blocked);
}
