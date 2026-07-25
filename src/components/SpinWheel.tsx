"use client";

import { useState } from "react";
import { Gift, Loader2, Sparkles } from "lucide-react";

type SpinPrize = { prize: string; code: string | null };

export function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<SpinPrize | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function spin() {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    setError(null);
    setRotation((current) => current + 1440 + Math.floor(Math.random() * 360));

    try {
      const response = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error === "already_used"
          ? "You have already used your spin."
          : data.error || "The wheel could not spin. Please try again.");
      }
      await new Promise((resolve) => window.setTimeout(resolve, 3200));
      setPrize(data.prize);
    } catch (spinError) {
      setError(spinError instanceof Error ? spinError.message : "The wheel could not spin.");
    } finally {
      setSpinning(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="spin-wheel-title">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-amber-400/25 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(0,0,0,0.92))] p-8 lg:grid-cols-2 lg:items-center lg:p-12">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300/70">Member Rewards</p>
          <h2 id="spin-wheel-title" className="text-4xl font-semibold sm:text-5xl">
            Spin for a <span className="text-amber-300">High Society reward.</span>
          </h2>
          <p className="max-w-xl text-lg leading-8 text-zinc-300">
            Try your luck for discounts, delivery rewards, points, and tokens. Signed-in members get one spin.
          </p>
          <button type="button" onClick={spin} disabled={spinning}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-400 px-7 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
            {spinning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
          <div aria-live="polite" className="min-h-16">
            {prize && <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-100">
              <p className="font-semibold">You won: {prize.prize}</p>
              {prize.code && <p className="mt-1 text-sm">Code: <strong>{prize.code}</strong></p>}
            </div>}
            {error && <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
          </div>
        </div>
        <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
          <div className="absolute -top-3 z-10 h-0 w-0 border-x-[14px] border-t-[28px] border-x-transparent border-t-amber-200" />
          <div className="relative h-full w-full rounded-full border-8 border-amber-300/70 shadow-[0_0_60px_rgba(245,158,11,0.25)] transition-transform duration-[3000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)`, background: "conic-gradient(#f59e0b 0deg 60deg,#18181b 60deg 120deg,#fbbf24 120deg 180deg,#27272a 180deg 240deg,#d97706 240deg 300deg,#09090b 300deg 360deg)" }}>
            {["10% OFF", "POINTS", "15% OFF", "TOKENS", "DELIVERY", "TRY AGAIN"].map((label, index) => (
              <span key={label} className="absolute left-1/2 top-1/2 w-28 origin-left text-center text-[11px] font-bold text-white drop-shadow"
                style={{ transform: `rotate(${index * 60 + 30}deg) translateX(42px)` }}>{label}</span>
            ))}
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-200 bg-black text-amber-300">
              <Gift className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
