"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCode(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as {
        discountCode?: string;
        alreadySubscribed?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setCode(data.discountCode ?? null);
      setAlreadySubscribed(data.alreadySubscribed ?? false);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (code) {
    return (
      <div className="space-y-3 rounded-2xl bg-white/[.055] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-[30px]">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-300" />
        <h3 className="text-lg font-semibold text-white">
          {alreadySubscribed ? "Already subscribed!" : "You're in! 🎉"}
        </h3>
        <p className="text-sm text-white/55">
          {alreadySubscribed
            ? "Here's your existing 10% discount code:"
            : "Welcome to the High Society inner circle. Your 10% off code:"}
        </p>
        <div className="rounded-xl bg-black/25 px-6 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
          <p className="font-mono text-2xl font-bold tracking-widest text-cyan-300">{code}</p>
        </div>
        <p className="text-xs text-white/40">Use at checkout · One-time use · Cannot be combined</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white/[.045] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-[30px]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.07]">
          <Mail className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Get 10% Off Your First Order</h3>
          <p className="text-sm text-white/50">Join our newsletter for drops, deals & more</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="min-w-0 flex-1 rounded-xl bg-white/[.07] px-4 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,.09)] outline-none placeholder:text-white/30 focus:ring-2 focus:ring-cyan-300/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#050505] transition-colors hover:bg-cyan-50 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-white/38">No spam. Unsubscribe any time. 21+ only.</p>
    </div>
  );
}
