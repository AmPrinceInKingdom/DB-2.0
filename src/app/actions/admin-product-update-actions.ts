"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function updateProductAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Admin access required." };
  }

  const productId = String(formData.get("product_id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("short_description") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const thumbnailUrl = String(formData.get("thumbnail_url") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();
  const isFeatured = String(formData.get("is_featured") || "") === "true";

  const price = Number(formData.get("price") || 0);
  const compareAtPriceRaw = String(formData.get("compare_at_price") || "").trim();
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
  const stockQuantity = Number(formData.get("stock_quantity") || 0);

  if (!productId) {
    return { error: "Product ID is required." };
  }

  if (!name) {
    return { error: "Product name is required." };
  }

  if (!price || price <= 0) {
    return { error: "Valid price is required." };
  }

  if (status === "active" && !thumbnailUrl) {
    return { error: "Active products need a cover image." };
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", productId)
    .maybeSingle();

  if (existingSlug) {
    return { error: "Slug already exists. Please use a different slug." };
  }

  const { error } = await supabase
    .from("products")
    .update({
      category_id: categoryId || null,
      name,
      slug,
      short_description: shortDescription || null,
      description: description || null,
      sku: sku || null,
      price,
      compare_at_price: compareAtPrice,
      stock_quantity: stockQuantity,
      status,
      is_featured: isFeatured,
      thumbnail_url: thumbnailUrl || null,
    })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/product/[slug]", "page");

  return { success: "Product updated successfully." };
}