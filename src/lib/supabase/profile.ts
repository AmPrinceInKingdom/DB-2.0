import { supabase } from "@/lib/supabase/client";

export async function createProfileIfMissing() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError ?? new Error("User not found"), profile: null };
  }

  const { data: existingProfiles, error: profileCheckError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .limit(1);

  if (profileCheckError) {
    return { error: profileCheckError, profile: null };
  }

  const existingProfile = existingProfiles?.[0] ?? null;

  if (existingProfile) {
    return { error: null, profile: existingProfile };
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    role: "customer",
  });

  if (insertError) {
    return { error: insertError, profile: null };
  }

  const { data: createdProfiles, error: createdProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .limit(1);

  if (createdProfileError) {
    return { error: createdProfileError, profile: null };
  }

  return {
    error: null,
    profile: createdProfiles?.[0] ?? null,
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
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .limit(1);

  if (profileError) {
    return { user, profile: null, error: profileError };
  }

  let profile = profiles?.[0] ?? null;

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