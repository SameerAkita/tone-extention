"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900">
      <main className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl md:grid-cols-2">
        <section className="bg-emerald-900 p-10 text-emerald-50">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">Tone</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight">
            Rewrite with the right voice.
          </h1>
          <p className="mt-4 text-emerald-100/90">
            Sign in to sync your extension, manage usage, and keep your tone
            preferences consistent everywhere.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-emerald-100/90">
            <li>Browser extension sync</li>
            <li>Secure account settings</li>
            <li>Usage and billing visibility</li>
          </ul>
        </section>

        <section className="p-8 md:p-10">
          <div className="inline-flex rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-white text-zinc-900 shadow"
                  : "text-zinc-500"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-white text-zinc-900 shadow"
                  : "text-zinc-500"
              }`}
            >
              Create Account
            </button>
          </div>

          <form className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Full name</span>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none transition focus:border-emerald-700"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none transition focus:border-emerald-700"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none transition focus:border-emerald-700"
              />
            </label>
            {mode === "signin" && (
              <div className="text-right text-sm">
                <a href="#" className="text-emerald-800 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-800 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Google
            </button>
            <button
              type="button"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              GitHub
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
