import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  return settings;
}