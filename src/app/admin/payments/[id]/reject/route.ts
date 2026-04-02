import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: proof } = await supabase
    .from("payment_proofs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!proof) {
    return NextResponse.redirect(new URL("/admin/payments", request.url));
  }

  await supabase
    .from("payment_proofs")
    .update({
      verification_status: "rejected",
    })
    .eq("id", proof.id);

  await supabase
    .from("orders")
    .update({
      payment_status: "pending",
    })
    .eq("id", proof.order_id);

  return NextResponse.redirect(new URL("/admin/payments", request.url));
}