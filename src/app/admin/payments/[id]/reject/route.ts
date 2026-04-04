import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

type PaymentProof = {
  id: string;
  order_id: string;
};

export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proof, error: proofError } = await supabase
    .from("payment_proofs" as never)
    .select("*")
    .eq("id", id)
    .single();

  const proofRow = proof as PaymentProof | null;

  if (proofError || !proofRow) {
    return NextResponse.redirect(new URL("/admin/payments", request.url));
  }

  const { error: proofUpdateError } = await supabase
    .from("payment_proofs" as never)
    .update(
      {
        verification_status: "rejected",
      } as never
    )
    .eq("id", proofRow.id);

  if (proofUpdateError) {
    return NextResponse.redirect(new URL("/admin/payments", request.url));
  }

  await supabase
    .from("orders" as never)
    .update(
      {
        payment_status: "pending",
      } as never
    )
    .eq("id", proofRow.order_id);

  return NextResponse.redirect(new URL("/admin/payments", request.url));
}