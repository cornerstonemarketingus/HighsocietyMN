"use client";

import { useState } from "react";
import { Gift, Loader2, Sparkles } from "lucide-react";

type SpinPrize = {
  prize: string;
  prizeType: string;
  prizeValue: number;
  code: string | null;
};

export function SpinWheel({ email }: { email?: string } = {}) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<SpinPrize | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function spin() {
    if (spinning) return;

    setSpinning(true);
    setPrize(null);
    setError(null);
    try {
      const response = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error === "already_used"
            ? "You have already used your spin."
            : data.error || "The wheel could not spin. Please try again.",
        );
      }

      const prizeIndex =
        data.prize.prizeType === "discount" && data.prize.prizeValue === 10 ? 0 :
        data.prize.prizeType === "points" ? 1 :
        data.prize.prizeType === "discount" ? 2 :
        data.prize.prizeType === "tokens" ? 3 :
        data.prize.prizeType === "free_delivery" ? 4 : 5;
      setRotation((current) => current + 1440 + (360 - (prizeIndex * 60 + 30)));
      await new Promise((resolve) => window.setTimeout(resolve, 3200));
      setPrize(data.prize);
      if (data.prize.code) localStorage.setItem("hs_spin_code", data.prize.code);
    } catch (spinError) {
      setError(spinError instanceof Error ? spinError.message : "The wheel could not spin.");
    } finally {
      setSpinning(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="spin-wheel-title">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-indigo-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:items-center lg:p-12">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-600/70">Member Rewards</p>
          <h2 id="spin-wheel-title" className="text-4xl font-semibold sm:text-5xl">
            Spin for a <span className="text-indigo-600">High Society reward.</span>
          </h2>
          <p className="max-w-xl text-lg leading-8 text-slate-700">
            Try your luck for discounts, delivery rewards, points, and tokens. Signed-in members get one spin.
          </p>
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 font-semibold text-white transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {spinning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
          <div aria-live="polite" className="min-h-16">
            {prize && (
              <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-indigo-100">
                <p className="font-semibold">You won: {prize.prize}</p>
                {prize.code && <p className="mt-1 text-sm">Code: <strong>{prize.code}</strong></p>}
              </div>
            )}
            {error && <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-80 items-center justify-center">
          <div className="absolute -top-3 z-10 h-0 w-0 border-x-[14px] border-t-[28px] border-x-transparent border-t-indigo-200" />
          <div
            className="relative h-full w-full rounded-full border-8 border-indigo-300/70 shadow-[0_0_60px_rgba(79,70,229,0.25)] transition-transform duration-[3000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background:
                "conic-gradient(#4f46e5 0deg 60deg,#e0e7ff 60deg 120deg,#818cf8 120deg 180deg,#c7d2fe 180deg 240deg,#4338ca 240deg 300deg,#eef2ff 300deg 360deg)",
            }}
          >
            {["10% OFF", "POINTS", "15% OFF", "TOKENS", "DELIVERY", "TRY AGAIN"].map((label, index) => (
              <span
                key={label}
                className="absolute left-1/2 top-1/2 w-28 origin-left text-center text-[11px] font-bold text-slate-950 drop-shadow"
                style={{ transform: `rotate(${index * 60 + 30}deg) translateX(42px)` }}
              >
                {label}
              </span>
            ))}
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-indigo-200 bg-white text-indigo-600">
              <Gift className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
