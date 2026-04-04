"use client";

import { Building2, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState("card");

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Payment method
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Choose how you want to pay
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Use a simpler payment selection with clear options and less noise.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <button
          type="button"
          onClick={() => setSelectedMethod("card")}
          className={`w-full rounded-[24px] border p-4 text-left transition ${
            selectedMethod === "card"
              ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                selectedMethod === "card"
                  ? "bg-white text-red-600 dark:bg-zinc-950 dark:text-red-400"
                  : "bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
              }`}
            >
              <CreditCard className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Card payment
                </p>
                <span
                  className={`inline-flex h-5 w-5 rounded-full border ${
                    selectedMethod === "card"
                      ? "border-red-600 bg-red-600"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Pay securely with debit or credit card.
              </p>
            </div>
          </div>
        </button>

        {selectedMethod === "card" && (
          <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Card number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Expiry date
                </label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name on card
                </label>
                <input
                  type="text"
                  placeholder="Dushan Perera"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSelectedMethod("bank")}
          className={`w-full rounded-[24px] border p-4 text-left transition ${
            selectedMethod === "bank"
              ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                selectedMethod === "bank"
                  ? "bg-white text-red-600 dark:bg-zinc-950 dark:text-red-400"
                  : "bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Bank transfer
                </p>
                <span
                  className={`inline-flex h-5 w-5 rounded-full border ${
                    selectedMethod === "bank"
                      ? "border-red-600 bg-red-600"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Place the order and complete payment through bank transfer.
              </p>
            </div>
          </div>
        </button>

        {selectedMethod === "bank" && (
          <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Bank name
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  Deal Bazaar Bank
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Account number
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  1234567890
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Branch
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  Tangalle
                </span>
              </div>

              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  After transfer, you can upload the payment slip in the next
                  step or from your order page.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Cleaner and safer payment flow
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Minimal layout helps customers understand payment choices more
                easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}