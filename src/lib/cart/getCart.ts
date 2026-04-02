import { createClient } from "@/lib/supabase/server";

export async function getCart() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("carts")
    .select(`
      *,
      cart_items (
        *,
        products (
          id,
          name,
          slug,
          price,
          thumbnail_url
        )
      )
    `)
    .eq("user_id", user.id)
    .single();

  return data;
}