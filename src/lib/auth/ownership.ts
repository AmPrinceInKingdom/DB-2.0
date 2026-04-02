import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserWithRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, role: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    role: profile?.role ?? null,
  };
}

export async function canManageProduct(productId: string) {
  const { supabase, user, role } = await getCurrentUserWithRole();

  if (!user || !role) {
    return { supabase, allowed: false, user: null, role: null };
  }

  if (role === "admin") {
    return { supabase, allowed: true, user, role };
  }

  if (role !== "seller") {
    return { supabase, allowed: false, user, role };
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, seller_id")
    .eq("id", productId)
    .single();

  const allowed = !!product && product.seller_id === user.id;

  return { supabase, allowed, user, role };
}

export async function canViewOrderForSeller(orderId: string) {
  const { supabase, user, role } = await getCurrentUserWithRole();

  if (!user || !role) {
    return { supabase, allowed: false, user: null, role: null };
  }

  if (role === "admin") {
    return { supabase, allowed: true, user, role };
  }

  if (role !== "seller") {
    return { supabase, allowed: false, user, role };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id,
      products (
        seller_id
      )
    `)
    .eq("order_id", orderId);

  const allowed =
    items?.some((item: any) => item.products?.seller_id === user.id) ?? false;

  return { supabase, allowed, user, role };
}