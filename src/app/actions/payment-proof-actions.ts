"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadPaymentProofAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Please log in first." };
    }

    const orderId = String(formData.get("order_id") || "");
    const note = String(formData.get("note") || "");
    const file = formData.get("file");

    if (!orderId) {
      return { error: "Order ID is required." };
    }

    if (!(file instanceof File) || file.size === 0) {
      return { error: "Please choose an image file." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Only JPG, PNG, or WEBP files are allowed." };
    }

    const { data: order, error: orderError } = await supabase
      .from("orders" as never)
      .select("id, user_id, order_number")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    const orderRow = order as
      | {
          id: string;
          user_id: string;
          order_number: string;
        }
      | null;

    if (orderError || !orderRow) {
      return { error: "Order not found." };
    }

    const extension = file.name.split(".").pop() || "jpg";
    const filePath = `${user.id}/${orderRow.order_number}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase
      .from("payment_proofs" as never)
      .insert({
        order_id: orderRow.id,
        user_id: user.id,
        image_url: imageUrl,
        note: note || null,
        verification_status: "pending",
      } as never);

    if (insertError) {
      return { error: insertError.message };
    }

    const { error: updateOrderError } = await supabase
      .from("orders" as never)
      .update({
        payment_status: "awaiting_verification",
      } as never)
      .eq("id", orderRow.id);

    if (updateOrderError) {
      return { error: updateOrderError.message };
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderRow.order_number}`);

    return { success: "Payment proof uploaded successfully." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}