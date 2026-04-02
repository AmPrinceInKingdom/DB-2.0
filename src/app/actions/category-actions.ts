"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createCategoryAction(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const isActive = formData.get("is_active") === "true";

  if (!name) {
    return { error: "Name required" };
  }

  const slug = slugInput || slugify(name);

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    is_active: isActive,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");

  return { success: "Category created" };
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = await createClient();

  const categoryId = String(formData.get("category_id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const isActive = formData.get("is_active") === "true";

  if (!categoryId) {
    return { error: "Category ID required" };
  }

  if (!name) {
    return { error: "Name required" };
  }

  const slug = slugInput || slugify(name);

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      is_active: isActive,
    })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${categoryId}/edit`);
  revalidatePath("/shop");

  return { success: "Category updated" };
}

export async function deleteCategoryAction(formData: FormData) {
  const supabase = await createClient();

  const categoryId = String(formData.get("category_id") || "");

  if (!categoryId) {
    return { error: "Category ID required" };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");

  return { success: "Category deleted" };
}