"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function RewardsPage() {
  const [balance, setBalance] = useState({ points: 0, tokens: 0 });
  const [reels, setReels] = useState(["🌿", "⭐", "💎"]);
  const [message, setMessage] = useState("");
  const [matchSymbols, setMatchSymbols] = useState(["?", "?", "?"]);
  const [matchMessage, setMatchMessage] = useState("");
  const [matchLoading, setMatchLoading] = useState(false);
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
  async function playMatch(pick: number) {
    setMatchLoading(true);
    setMatchMessage("");
    setMatchSymbols(["…", "…", "…"]);
    try {
      const response = await fetch("/api/minigame/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pick }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMatchSymbols(["?", "?", "?"]);
        return setMatchMessage(data.error || "Game unavailable.");
      }
      setMatchSymbols([0, 1, 2].map((index) => index === data.winningIndex ? "💎" : "🌿"));
      setMatchMessage(data.won ? `Perfect match — you won ${data.winTokens} tokens.` : "The gem was in another jar. Try again.");
      setBalance((current) => ({ ...current, tokens: data.newBalance }));
    } finally {
      setMatchLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Member rewards</p><h1 className="mt-2 text-4xl font-semibold">Play and earn.</h1><p className="mt-3 text-slate-600">{balance.points} points · {balance.tokens} tokens</p></div>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">Society Slots</h2>
          <div className="mx-auto my-6 flex max-w-sm justify-center gap-3 rounded-2xl bg-indigo-50 p-6 text-5xl">{reels.map((reel, index) => <span key={index} className="rounded-xl bg-white p-4 shadow-sm">{reel}</span>)}</div>
          <Button onClick={play}>Play for 10 tokens</Button>
          {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        </section>
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">New mini-game</p>
          <h2 className="mt-2 text-2xl font-semibold">Terpene Match</h2>
          <p className="mt-2 text-sm text-slate-600">Pick the jar hiding the gem. Each play costs 5 free-play tokens; a match awards 20.</p>
          <div className="mx-auto my-6 grid max-w-md grid-cols-3 gap-3">
            {matchSymbols.map((symbol, index) => (
              <button key={index} type="button" disabled={matchLoading} onClick={() => playMatch(index)}
                className="flex aspect-square items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 text-4xl transition hover:-translate-y-1 hover:border-indigo-400 disabled:opacity-60"
                aria-label={`Choose jar ${index + 1}`}>
                {symbol}
              </button>
            ))}
          </div>
          {matchMessage && <p className="text-sm text-slate-600">{matchMessage}</p>}
        </section>
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-semibold text-slate-950">Tokens</p><p className="mt-2 text-sm leading-6 text-slate-600">Free promotional play credits earned through eligible site activity. Tokens have no cash value and cannot be purchased.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-semibold text-slate-950">Points</p><p className="mt-2 text-sm leading-6 text-slate-600">Member-status points may unlock access or non-cannabis perks. They are not currency and are not transferable.</p></div>
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5"><p className="font-semibold text-indigo-950">Cannabis redemption</p><p className="mt-2 text-sm leading-6 text-indigo-900">Points and tokens are not redeemable for cannabis, THC products, cash, or anything prohibited by Minnesota law.</p></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
