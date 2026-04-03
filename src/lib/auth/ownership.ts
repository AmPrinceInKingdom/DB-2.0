import { createClient } from "@/lib/supabase/server";

type UserRole = "admin" | "seller" | "customer" | null;

type ProfileRow = {
  role?: string | null;
};

type ProductRow = {
  seller_id?: string | null;
};

type OrderItemRow = {
  products?: {
    seller_id?: string | null;
  } | null;
};

type OwnershipResult = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: any | null;
  role: UserRole;
};

export async function getCurrentUserWithRole(): Promise<OwnershipResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, role: null };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = (data ?? null) as ProfileRow | null;

  return {
    supabase,
    user,
    role: (profile?.role as UserRole) ?? null,
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

  const { data } = await supabase
    .from("products")
    .select("id, seller_id")
    .eq("id", productId)
    .single();

  const product = (data ?? null) as ProductRow | null;
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

  const { data } = await supabase
    .from("order_items")
    .select(
      `
      id,
      products (
        seller_id
      )
    `
    )
    .eq("order_id", orderId);

  const items = (data ?? []) as OrderItemRow[];

  const allowed = items.some((item) => item.products?.seller_id === user.id);

  return { supabase, allowed, user, role };
}
