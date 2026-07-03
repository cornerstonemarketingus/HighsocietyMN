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
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-3">
        <CheckCircle className="h-10 w-10 text-amber-400 mx-auto" />
        <h3 className="text-white font-semibold text-lg">
          {alreadySubscribed ? "Already subscribed!" : "You're in! 🎉"}
        </h3>
        <p className="text-gray-400 text-sm">
          {alreadySubscribed
            ? "Here's your existing 10% discount code:"
            : "Welcome to the High Society inner circle. Your 10% off code:"}
        </p>
        <div className="rounded-xl border border-amber-500/50 bg-black/50 py-3 px-6">
          <p className="text-2xl font-bold font-mono text-amber-400 tracking-widest">{code}</p>
        </div>
        <p className="text-xs text-gray-500">Use at checkout · One-time use · Cannot be combined</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
          <Mail className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Get 10% Off Your First Order</h3>
          <p className="text-gray-400 text-sm">Join our newsletter for drops, deals & more</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-amber-500 text-black px-5 py-2.5 text-sm font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-gray-600">No spam. Unsubscribe any time. 21+ only.</p>
    </div>
  );
}
