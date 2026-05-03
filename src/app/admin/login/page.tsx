"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError("邮箱或密码错误");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center text-accent">Editor's Desk</p>
        <h1 className="mb-8 text-center font-serif text-4xl font-bold tracking-tightest">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="eyebrow mb-2 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-ink bg-transparent py-2 font-serif text-lg outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="eyebrow mb-2 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-ink bg-transparent py-2 font-serif text-lg outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p className="border-l-2 border-accent bg-accent-soft/50 px-3 py-2 font-sans text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full border border-ink bg-ink py-3 font-sans text-sm uppercase tracking-widest text-paper transition-colors hover:bg-accent hover:border-accent disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Enter"}
          </button>
        </form>

        <p className="mt-8 text-center font-sans text-xs italic text-muted">
          For editors only · Manuscripts in progress.
        </p>
      </div>
    </main>
  );
}
