"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireSeller() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: "Please log in first." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "seller") {
    return { supabase, user: null, error: "Seller access required." };
  }

  return { supabase, user, error: null };
}

export async function createSellerProductAction(formData: FormData) {
  const { supabase, user, error: sellerError } = await requireSeller();
  if (sellerError || !user) {
    return { error: sellerError || "Seller access required." };
  }

  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("short_description") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const thumbnailUrl = String(formData.get("thumbnail_url") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const price = Number(formData.get("price") || 0);
  const compareAtPriceRaw = String(formData.get("compare_at_price") || "").trim();
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
  const stockQuantity = Number(formData.get("stock_quantity") || 0);

  if (!name) {
    return { error: "Product name is required." };
  }

  if (!price || price <= 0) {
    return { error: "Valid price is required." };
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return { error: "Slug already exists. Please use a different slug." };
  }

  const { data: insertedProduct, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      category_id: categoryId || null,
      name,
      slug,
      short_description: shortDescription || null,
      description: description || null,
      sku: sku || null,
      price,
      compare_at_price: compareAtPrice,
      stock_quantity: stockQuantity,
      status: "draft",
      is_featured: false,
      thumbnail_url: thumbnailUrl || null,
    })
    .select("id")
    .single();

  if (error || !insertedProduct) {
    return { error: error?.message || "Failed to create product." };
  }

  revalidatePath("/seller/products");
  revalidatePath("/seller");
  revalidatePath("/shop");

  redirect(`/seller/products/${insertedProduct.id}/edit`);
}