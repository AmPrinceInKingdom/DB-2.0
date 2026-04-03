import { supabase } from "@/lib/supabase/client";

type ProfileRow = {
  id: string;
  email: string | null;
  role: string | null;
  [key: string]: any;
};

type ProfileInsertRow = {
  id: string;
  email: string | null;
  role: string;
};

export async function createProfileIfMissing() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError ?? new Error("User not found"), profile: null };
  }

  const { data: existingProfiles, error: profileCheckError } = await supabase
    .from("profiles" as never)
    .select("id, email, role")
    .eq("id", user.id)
    .limit(1);

  if (profileCheckError) {
    return { error: profileCheckError, profile: null };
  }

  const existingProfile =
    ((existingProfiles as ProfileRow[] | null) ?? [])[0] ?? null;

  if (existingProfile) {
    return { error: null, profile: existingProfile };
  }

  const payload: ProfileInsertRow = {
    id: user.id,
    email: user.email ?? null,
    role: "customer",
  };

  const { error: insertError } = await supabase
    .from("profiles" as never)
    .insert([payload] as never);

  if (insertError) {
    return { error: insertError, profile: null };
  }

  const { data: createdProfiles, error: createdProfileError } = await supabase
    .from("profiles" as never)
    .select("*")
    .eq("id", user.id)
    .limit(1);

  if (createdProfileError) {
    return { error: createdProfileError, profile: null };
  }

  return {
    error: null,
    profile: (((createdProfiles as ProfileRow[] | null) ?? [])[0] ?? null),
  };
}

export async function getCurrentUserProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      error: userError ?? new Error("User not found"),
    };
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles" as never)
    .select("*")
    .eq("id", user.id)
    .limit(1);

  if (profileError) {
    return { user, profile: null, error: profileError };
  }

  let profile = (((profiles as ProfileRow[] | null) ?? [])[0] ?? null);

  if (!profile) {
    const created = await createProfileIfMissing();

    if (created.error) {
      return { user, profile: null, error: created.error };
    }

    profile = created.profile;
  }

  return {
    user,
    profile,
    error: null,
  };
}
