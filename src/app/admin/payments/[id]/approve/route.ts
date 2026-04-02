import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proof, error: proofError } = await supabase
    .from("payment_proofs")
    .select("*")
    .eq("id", id)
    .single();

  if (proofError || !proof) {
    return NextResponse.redirect(new URL("/admin/payments", request.url));
  }

  const { error: proofUpdateError } = await supabase
    .from("payment_proofs")
    .update({
      verification_status: "approved",
    })
    .eq("id", proof.id);

  if (proofUpdateError) {
    return NextResponse.redirect(new URL("/admin/payments", request.url));
  }

  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      order_status: "processing",
    })
    .eq("id", proof.order_id);

  return NextResponse.redirect(new URL("/admin/payments", request.url));
}