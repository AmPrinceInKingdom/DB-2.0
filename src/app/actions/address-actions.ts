"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isChecked(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

export async function createAddressAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const label = getString(formData, "label");
  const recipientName = getString(formData, "recipient_name");
  const phone = getString(formData, "phone");
  const addressLine1 = getString(formData, "address_line_1");
  const addressLine2 = getString(formData, "address_line_2");
  const city = getString(formData, "city");
  const state = getString(formData, "state");
  const postalCode = getString(formData, "postal_code");
  const country = getString(formData, "country") || "Sri Lanka";
  const addressType = getString(formData, "address_type") || "home";
  const isDefault = isChecked(formData, "is_default");

  if (!recipientName || !phone || !addressLine1 || !city) {
    return { error: "Please fill all required fields." };
  }

  if (isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      label: label || null,
      recipient_name: recipientName,
      phone,
      address_line_1: addressLine1,
      address_line_2: addressLine2 || null,
      city,
      state: state || null,
      postal_code: postalCode || null,
      country,
      address_type: addressType,
      is_default: isDefault,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");

  return { success: "Address added successfully." };
}

export async function updateAddressAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const addressId = getString(formData, "address_id");
  const label = getString(formData, "label");
  const recipientName = getString(formData, "recipient_name");
  const phone = getString(formData, "phone");
  const addressLine1 = getString(formData, "address_line_1");
  const addressLine2 = getString(formData, "address_line_2");
  const city = getString(formData, "city");
  const state = getString(formData, "state");
  const postalCode = getString(formData, "postal_code");
  const country = getString(formData, "country") || "Sri Lanka";
  const addressType = getString(formData, "address_type") || "home";
  const isDefault = isChecked(formData, "is_default");

  if (!addressId) {
    return { error: "Address ID is required." };
  }

  if (!recipientName || !phone || !addressLine1 || !city) {
    return { error: "Please fill all required fields." };
  }

  const { data: existingAddress, error: existingAddressError } = await supabase
    .from("addresses")
    .select("id, user_id")
    .eq("id", addressId)
    .single();

  if (existingAddressError || !existingAddress) {
    return { error: "Address not found." };
  }

  if (existingAddress.user_id !== user.id) {
    return { error: "Unauthorized." };
  }

  if (isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      label: label || null,
      recipient_name: recipientName,
      phone,
      address_line_1: addressLine1,
      address_line_2: addressLine2 || null,
      city,
      state: state || null,
      postal_code: postalCode || null,
      country,
      address_type: addressType,
      is_default: isDefault,
    })
    .eq("id", addressId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account/addresses");
  revalidatePath(`/account/addresses/${addressId}/edit`);
  revalidatePath("/checkout");

  return { success: "Address updated successfully." };
}

export async function deleteAddressAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const addressId = getString(formData, "address_id");

  if (!addressId) {
    return { error: "Address ID is required." };
  }

  const { data: address } = await supabase
    .from("addresses")
    .select("user_id")
    .eq("id", addressId)
    .single();

  if (!address || address.user_id !== user.id) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");

  return { success: "Address deleted." };
}

export async function setDefaultAddressAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in first." };
  }

  const addressId = getString(formData, "address_id");

  if (!addressId) {
    return { error: "Address ID required." };
  }

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");

  return { success: "Default address updated." };
}