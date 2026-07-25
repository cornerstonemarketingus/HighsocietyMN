"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { SpinWheel } from "@/components/SpinWheel";

export default function RewardsPage() {
  const [balance, setBalance] = useState({ points: 0, tokens: 0 });
  const [reels, setReels] = useState(["🌿", "⭐", "💎"]);
  const [message, setMessage] = useState("");
  const load = () => fetch("/api/points").then((r) => r.ok ? r.json() : { points: 0, tokens: 0 }).then(setBalance);
  useEffect(() => { load(); }, []);
  async function play() {
    setMessage("");
    const response = await fetch("/api/minigame", { method: "POST" });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Game unavailable.");
    setReels(data.reels);
    setMessage(data.winTokens ? `You won ${data.winTokens} tokens.` : "Try again.");
    setBalance((current) => ({ ...current, tokens: data.newBalance }));
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Member rewards</p><h1 className="mt-2 text-4xl font-semibold">Play, earn, redeem.</h1><p className="mt-3 text-slate-600">{balance.points} points · {balance.tokens} tokens</p></div>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">Society Slots</h2>
          <div className="mx-auto my-6 flex max-w-sm justify-center gap-3 rounded-2xl bg-indigo-50 p-6 text-5xl">{reels.map((reel, index) => <span key={index} className="rounded-xl bg-white p-4 shadow-sm">{reel}</span>)}</div>
          <Button onClick={play}>Play for 10 tokens</Button>
          {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        </section>
        <SpinWheel />
      </main>
      <Footer />
    </div>
  );
}
