"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdminOrSeller() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, role: null, error: "Please log in first." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "seller"].includes(profile.role)) {
    return {
      supabase,
      user: null,
      role: null,
      error: "Admin or seller access required.",
    };
  }

  return { supabase, user, role: profile.role, error: null };
}

async function verifyProductOwnershipOrAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  userId: string,
  role: string
) {
  if (role === "admin") return true;

  const { data: product } = await supabase
    .from("products")
    .select("id, seller_id")
    .eq("id", productId)
    .single();

  return !!product && product.seller_id === userId;
}

export async function addProductImageAction(formData: FormData) {
  const productId = String(formData.get("product_id") || "");
  const imageUrl = String(formData.get("image_url") || "").trim();

  if (!productId || !imageUrl) {
    return { error: "Missing data." };
  }

  const { supabase, user, role, error } = await requireAdminOrSeller();
  if (error || !user || !role) {
    return { error: error || "Access denied." };
  }

  const allowed = await verifyProductOwnershipOrAdmin(
    supabase,
    productId,
    user.id,
    role
  );

  if (!allowed) {
    return { error: "You can only manage your own product images." };
  }

  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  if ((count ?? 0) >= 4) {
    return { error: "Maximum 4 extra gallery images allowed." };
  }

  const { data: lastImage } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (lastImage?.sort_order ?? 0) + 1;

  const { error: insertError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: imageUrl,
    sort_order: nextSortOrder,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/seller/products/${productId}/edit`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/product/[slug]", "page");

  return { success: "Image added successfully." };
}

export async function deleteProductImageAction(formData: FormData) {
  const imageId = String(formData.get("image_id") || "");
  const productId = String(formData.get("product_id") || "");

  if (!imageId || !productId) {
    return { error: "Missing data." };
  }

  const { supabase, user, role, error } = await requireAdminOrSeller();
  if (error || !user || !role) {
    return { error: error || "Access denied." };
  }

  const allowed = await verifyProductOwnershipOrAdmin(
    supabase,
    productId,
    user.id,
    role
  );

  if (!allowed) {
    return { error: "You can only manage your own product images." };
  }

  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/seller/products/${productId}/edit`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/product/[slug]", "page");

  return { success: "Image deleted successfully." };
}

export async function updateProductImageSortOrderAction(formData: FormData) {
  const imageId = String(formData.get("image_id") || "");
  const productId = String(formData.get("product_id") || "");
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!imageId || !productId) {
    return { error: "Missing data." };
  }

  const { supabase, user, role, error } = await requireAdminOrSeller();
  if (error || !user || !role) {
    return { error: error || "Access denied." };
  }

  const allowed = await verifyProductOwnershipOrAdmin(
    supabase,
    productId,
    user.id,
    role
  );

  if (!allowed) {
    return { error: "You can only manage your own product images." };
  }

  const { error: updateError } = await supabase
    .from("product_images")
    .update({
      sort_order: sortOrder,
    })
    .eq("id", imageId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/seller/products/${productId}/edit`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/product/[slug]", "page");

  return { success: "Sort order updated." };
}