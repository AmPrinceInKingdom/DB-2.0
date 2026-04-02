"use client";

import { Mail, Phone, User } from "lucide-react";

export default function ProfilePageView() {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Personal information
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Update your profile details
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            First name
          </label>
          <div className="relative mt-2">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input className="w-full h-11 rounded-xl border border-zinc-200 pl-10 pr-3 dark:border-zinc-800 dark:bg-zinc-900"/>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Last name</label>
          <input className="mt-2 w-full h-11 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900"/>
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"/>
            <input className="w-full h-11 rounded-xl border border-zinc-200 pl-10 dark:border-zinc-800 dark:bg-zinc-900"/>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <div className="relative mt-2">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"/>
            <input className="w-full h-11 rounded-xl border border-zinc-200 pl-10 dark:border-zinc-800 dark:bg-zinc-900"/>
          </div>
        </div>
      </div>

      <button className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full">
        Save changes
      </button>
    </div>
  );
}