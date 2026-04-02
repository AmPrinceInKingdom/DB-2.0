import { createClient } from "@/lib/supabase/server";
import { isUserBlocked } from "@/lib/is-user-blocked";

export async function requireActiveUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please login" };
  }

  const blocked = await isUserBlocked(user.id);

  if (blocked) {
    return { error: "Your account has been blocked. Contact support." };
  }

  return { user };
}