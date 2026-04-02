import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  // Load payment proofs with related order details.
  const { data: proofs } = await supabase
    .from("payment_proofs")
    .select(`
      *,
      orders (
        order_number,
        total_amount,
        payment_status,
        order_status
      )
    `)
    .order("uploaded_at", { ascending: false });

  function getProofStatusClasses(status: string) {
    if (status === "approved") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }

  function getOrderStatusClasses(status: string) {
    if (status === "delivered") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (status === "shipped") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    }

    if (status === "processing") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  function getPaymentStatusClasses(status: string) {
    if (status === "paid") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (status === "awaiting_verification") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }

    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  const list = proofs ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Payment verification
        </p>

        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          Payment Proofs
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Review uploaded bank transfer slips, check order status, and approve
          or reject payment verification requests.
        </p>
      </div>

      {/* Empty state */}
      {!list.length ? (
        <div className="mt-6 rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <ShieldCheck className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
            No payment proofs found
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Uploaded payment slips will appear here for admin verification.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((proof: any) => (
            <div
              key={proof.id}
              className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="p-5 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[1fr_220px]">
                  {/* Left side */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {proof.orders?.order_number || "Unknown Order"}
                      </h2>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getProofStatusClasses(
                          String(proof.verification_status || "")
                        )}`}
                      >
                        Proof: {proof.verification_status || "pending"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Total Amount
                        </p>
                        <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                          Rs.{" "}
                          {Number(
                            proof.orders?.total_amount || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Order Status
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                              String(proof.orders?.order_status || "")
                            )}`}
                          >
                            {proof.orders?.order_status || "pending"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Payment Status
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                              String(proof.orders?.payment_status || "")
                            )}`}
                          >
                            {proof.orders?.payment_status || "pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {proof.note ? (
                      <div className="mt-4 rounded-[20px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          Admin / customer note
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                          {proof.note}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-4">
                      <a
                        href={proof.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        View Slip
                      </a>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/admin/payments/${proof.id}/approve`}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      Approve
                    </Link>

                    <Link
                      href={`/admin/payments/${proof.id}/reject`}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Reject
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom helper bar */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 md:px-6">
                Use this page to verify bank transfer evidence and update order
                payment flow accurately.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}