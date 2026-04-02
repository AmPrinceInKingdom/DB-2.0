import { loginAction } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Login
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to your Deal Bazaar account.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none ring-0 placeholder:text-zinc-400 focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none ring-0 placeholder:text-zinc-400 focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}