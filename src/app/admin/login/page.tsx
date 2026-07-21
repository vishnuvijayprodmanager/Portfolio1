"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form
        onSubmit={submit}
        className="glass w-full max-w-sm rounded-2xl p-8"
      >
        <h1 className="font-display text-2xl">Admin</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Enter your password to edit the site.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="mt-6 w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-ink"
        />

        {error && <p className="mt-3 text-sm text-accent-ink">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-ink py-3 text-sm text-bg hover:bg-accent hover:text-ink disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
