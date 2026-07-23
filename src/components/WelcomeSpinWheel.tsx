"use client";

import { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";

const segments = ["10% OFF", "100 PTS", "FREE DELIVERY", "50 TOKENS", "15% OFF", "TRY AGAIN"];

export function WelcomeSpinWheel() {
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ prize: string; code?: string | null } | null>(null);

  useEffect(() => {
    const seen = window.localStorage.getItem("hs-spin-prompt-v1");
    if (!seen) {
      const timer = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function close() {
    window.localStorage.setItem("hs-spin-prompt-v1", new Date().toISOString());
    setOpen(false);
  }

  async function spin() {
    if (spinning || result) return;
    setSpinning(true);
    const landing = Math.floor(Math.random() * segments.length);
    setRotation((value) => value + 1440 + landing * 60);

    try {
      const response = await fetch("/api/spin", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await response.json();
      if (!response.ok) {
        if (data.error === "already_used") setResult({ prize: "Your welcome spin has already been claimed." });
        else throw new Error(data.error || "Spin failed");
      } else {
        setResult({ prize: data.prize.prize, code: data.prize.code });
      }
    } catch {
      setResult({ prize: "The wheel is resting. Your spin is still available—try again shortly." });
    } finally {
      window.setTimeout(() => setSpinning(false), 1500);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Welcome reward wheel">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-amber-400/30 bg-zinc-950 p-6 text-center shadow-2xl sm:p-8">
        <button onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close reward wheel"><X className="h-5 w-5" /></button>
        <Gift className="mx-auto h-8 w-8 text-amber-400" />
        <p className="mt-3 text-xs uppercase tracking-[0.35em] text-amber-300">Welcome to High Society</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Spin for your first reward</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">Unlock tokens, points, delivery perks, or a private discount.</p>

        <div className="relative mx-auto my-7 h-64 w-64">
          <div className="absolute left-1/2 top-[-8px] z-10 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-amber-300" />
          <div
            className="flex h-full w-full items-center justify-center rounded-full border-4 border-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.25)] transition-transform duration-[1500ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)`, background: "conic-gradient(#f59e0b 0deg 60deg,#18181b 60deg 120deg,#d97706 120deg 180deg,#27272a 180deg 240deg,#fbbf24 240deg 300deg,#09090b 300deg 360deg)" }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-zinc-950 bg-black text-sm font-bold text-amber-300">HS<br />REWARDS</div>
          </div>
        </div>

        {result ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
            <p className="text-sm text-zinc-300">You unlocked</p>
            <p className="mt-1 text-xl font-semibold text-amber-300">{result.prize}</p>
            {result.code && <p className="mt-2 font-mono text-sm text-white">Code: {result.code}</p>}
            <button onClick={close} className="mt-4 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-300">Enter High Society</button>
          </div>
        ) : (
          <button onClick={spin} disabled={spinning} className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70">{spinning ? "Spinning…" : "Spin the wheel"}</button>
        )}
        <button onClick={close} className="mt-3 text-xs text-zinc-500 hover:text-zinc-300">No thanks, continue browsing</button>
      </div>
    </div>
  );
}
