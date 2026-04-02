import { createClient } from "@/lib/supabase/server";

export async function getFeaturedProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Featured products error:", error);
    return [];
  }

  return data;
}

export async function getAllActiveProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("All products error:", error);
    return [];
  }

  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) {
    console.error("Single product error:", error);
    return null;
  }

  return data;
}