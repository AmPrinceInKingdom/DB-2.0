"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = ["draft", "active", "archived"] as const;
type AllowedProductStatus = (typeof allowedStatuses)[number];

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { supabase, error: "Please log in first." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return { supabase, error: "Admin access required." };
  }

  return { supabase, error: null };
}

export async function updateProductStatusAction(formData: FormData) {
  const productId = String(formData.get("product_id") || "");
  const status = String(formData.get("status") || "") as AllowedProductStatus;

  if (!productId) {
    return { error: "Product ID is required." };
  }

  if (!allowedStatuses.includes(status)) {
    return { error: "Invalid product status." };
  }

  const { supabase, error: adminError } = await requireAdmin();
  if (adminError) {
    return { error: adminError };
  }

  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/product/[slug]`, "page");

  return { success: `Product status changed to ${status}.` };
}

export async function toggleFeaturedProductAction(formData: FormData) {
  const productId = String(formData.get("product_id") || "");
  const nextValue = String(formData.get("next_value") || "") === "true";

  if (!productId) {
    return { error: "Product ID is required." };
  }

  const { supabase, error: adminError } = await requireAdmin();
  if (adminError) {
    return { error: adminError };
  }

  const { error } = await supabase
    .from("products")
    .update({ is_featured: nextValue })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return {
    success: nextValue ? "Product marked as featured." : "Product removed from featured.",
  };
}