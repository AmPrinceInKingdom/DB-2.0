import { createClient } from "@/lib/supabase/server";

export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "seller" | "user" | null;
  phone: string | null;
};

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, phone")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data as UserProfile;
}
