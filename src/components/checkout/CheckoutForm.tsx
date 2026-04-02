"use client";

import { MapPin, Phone, User } from "lucide-react";

export default function CheckoutForm() {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
          Shipping details
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Delivery information
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Keep details simple and clear to complete your order faster.
        </p>
      </div>

      <form className="mt-5 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              First name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Dushan"
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Last name
            </label>
            <input
              type="text"
              placeholder="Perera"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone number
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="tel"
                placeholder="+94 71 234 5678"
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Street address
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-zinc-400" />
            <textarea
              rows={4}
              placeholder="Street name, house number, area..."
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 pt-3.5 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              City
            </label>
            <input
              type="text"
              placeholder="Tangalle"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Postal code
            </label>
            <input
              type="text"
              placeholder="82200"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Country
            </label>
            <select className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
              <option>Sri Lanka</option>
              <option>India</option>
              <option>United Arab Emirates</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-red-600" />
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Save this address for faster checkout next time.
            </span>
          </label>
        </div>
      </form>
    </div>
  );
}