import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, error: "Please log in first." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile, error: null };
}

export async function requireAdmin() {
  const { user, profile, error } = await requireUser();

  if (error || !user || !profile) {
    return { user: null, profile: null, error: "Please log in first." };
  }

  if (profile.role !== "admin") {
    return { user: null, profile: null, error: "Admin access required." };
  }

  return { user, profile, error: null };
}

export async function requireSeller() {
  const { user, profile, error } = await requireUser();

  if (error || !user || !profile) {
    return { user: null, profile: null, error: "Please log in first." };
  }

  if (profile.role !== "seller") {
    return { user: null, profile: null, error: "Seller access required." };
  }

  return { user, profile, error: null };
}