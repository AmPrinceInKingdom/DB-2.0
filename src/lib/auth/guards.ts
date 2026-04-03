import { createClient } from "@/lib/supabase/server";

type Role = "customer" | "seller" | "admin";

type Profile = {
  id?: string;
  role?: Role;
  [key: string]: any;
};

type GuardResult = {
  user: any | null;
  profile: Profile | null;
  error: string | null;
};

export async function requireUser(): Promise<GuardResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, error: "Please log in first." };
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = (data ?? null) as Profile | null;

  return { user, profile, error: null };
}

export async function requireAdmin(): Promise<GuardResult> {
  const { user, profile, error } = await requireUser();

  if (error || !user || !profile) {
    return { user: null, profile: null, error: "Please log in first." };
  }

  if (profile?.role !== "admin") {
    return { user: null, profile: null, error: "Admin access required." };
  }

  return { user, profile, error: null };
}

export async function requireSeller(): Promise<GuardResult> {
  const { user, profile, error } = await requireUser();

  if (error || !user || !profile) {
    return { user: null, profile: null, error: "Please log in first." };
  }

  if (profile?.role !== "seller") {
    return { user: null, profile: null, error: "Seller access required." };
  }

  return { user, profile, error: null };
}
