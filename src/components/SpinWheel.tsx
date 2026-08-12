"use client";

import { useState } from "react";
import { Gift, Loader2, Sparkles } from "lucide-react";

type SpinPrize = {
  prize: string;
  prizeType: string;
  prizeValue: number;
  code: string | null;
};

// Mirrors the order and values of PRIZES in /api/spin so the wheel always lands on the right slice.
const WHEEL_SLICES: { label: string; prizeType: string; prizeValue: number; color: string }[] = [
  { label: "10% OFF", prizeType: "discount", prizeValue: 10, color: "#4f46e5" },
  { label: "15% OFF", prizeType: "discount", prizeValue: 15, color: "#818cf8" },
  { label: "20% OFF", prizeType: "discount", prizeValue: 20, color: "#4338ca" },
  { label: "DELIVERY", prizeType: "free_delivery", prizeValue: 0, color: "#e0e7ff" },
  { label: "POINTS", prizeType: "points", prizeValue: 100, color: "#c7d2fe" },
  { label: "TOKENS", prizeType: "tokens", prizeValue: 50, color: "#eef2ff" },
  { label: "TRY AGAIN", prizeType: "none", prizeValue: 0, color: "#a5b4fc" },
];

const SLICE_ANGLE = 360 / WHEEL_SLICES.length;
const WHEEL_GRADIENT = `conic-gradient(${WHEEL_SLICES.map(
  (slice, index) => `${slice.color} ${index * SLICE_ANGLE}deg ${(index + 1) * SLICE_ANGLE}deg`,
).join(",")})`;

function findSliceIndex(prize: SpinPrize): number {
  const index = WHEEL_SLICES.findIndex(
    (slice) => slice.prizeType === prize.prizeType && slice.prizeValue === prize.prizeValue,
  );
  return index === -1 ? WHEEL_SLICES.length - 1 : index;
}

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

      const sliceIndex = findSliceIndex(data.prize);
      setRotation((current) => current + 1440 + (360 - (sliceIndex * SLICE_ANGLE + SLICE_ANGLE / 2)));
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
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-green-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:items-center lg:p-12">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-green-600/70">Member Rewards</p>
          <h2 id="spin-wheel-title" className="text-4xl font-semibold sm:text-5xl">
            Spin for a <span className="text-green-600">High Society reward.</span>
          </h2>
          <p className="max-w-xl text-lg leading-8 text-slate-700">
            Try your luck for up to 20% off, delivery rewards, points, and tokens. Signed-in members get one spin.
          </p>
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 font-semibold text-white transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {spinning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
          <div aria-live="polite" className="min-h-16">
            {prize && (
              <div className="rounded-2xl border-2 border-green-500 bg-white p-5 text-slate-950 shadow-[0_16px_45px_-24px_rgba(79,70,229,.65)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Your reward</p>
                <p className="mt-2 text-xl font-bold leading-tight text-slate-950">You won: {prize.prize}</p>
                {prize.code && (
                  <p className="mt-3 inline-flex rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white">
                    Code: <strong className="ml-1.5 tracking-wide">{prize.code}</strong>
                  </p>
                )}
              </div>
            )}
            {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 font-medium text-red-800">{error}</p>}
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-80 items-center justify-center">
          <div className="absolute -top-3 z-10 h-0 w-0 border-x-[14px] border-t-[28px] border-x-transparent border-t-green-200" />
          <div
            className="relative h-full w-full rounded-full border-8 border-green-300/70 shadow-[0_0_60px_rgba(79,70,229,0.25)] transition-transform duration-[3000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: WHEEL_GRADIENT,
            }}
          >
            {WHEEL_SLICES.map((slice, index) => (
              <span
                key={slice.label}
                className="absolute left-1/2 top-1/2 w-28 origin-left text-center text-[11px] font-bold text-slate-950 drop-shadow"
                style={{ transform: `rotate(${index * SLICE_ANGLE + SLICE_ANGLE / 2}deg) translateX(42px)` }}
              >
                {slice.label}
              </span>
            ))}
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-green-200 bg-white text-green-600">
              <Gift className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
