"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
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

  if (!profile || profile.role !== "admin") {
    return { supabase, user: null, error: "Admin access required." };
  }

  return { supabase, user, error: null };
}

export async function updateUserRoleAction(formData: FormData) {
  const userId = String(formData.get("user_id") || "").trim();
  const role = String(formData.get("role") || "").trim();

  if (!userId) {
    return { error: "User ID required." };
  }

  if (!["customer", "seller", "admin"].includes(role)) {
    return { error: "Invalid role." };
  }

  const { supabase, user, error } = await requireAdmin();
  if (error || !user) {
    return { error: error || "Admin access required." };
  }

  if (user.id === userId && role !== "admin") {
    return { error: "You cannot remove your own admin role." };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin/users");

  return { success: "User role updated successfully." };
}

export async function toggleUserBlockedAction(formData: FormData) {
  const userId = String(formData.get("user_id") || "").trim();
  const nextBlocked = String(formData.get("next_blocked") || "") === "true";

  if (!userId) {
    return { error: "User ID required." };
  }

  const { supabase, user, error } = await requireAdmin();
  if (error || !user) {
    return { error: error || "Admin access required." };
  }

  if (user.id === userId && nextBlocked) {
    return { error: "You cannot block your own account." };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ is_blocked: nextBlocked })
    .eq("id", userId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin/users");

  return {
    success: nextBlocked
      ? "User blocked successfully."
      : "User unblocked successfully.",
  };
}