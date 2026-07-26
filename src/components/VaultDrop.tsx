"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, PackageOpen } from "lucide-react";

const DROP_DAYS = [2, 4, 6];
const OPEN_WINDOW_MS = 60 * 60 * 1000;

function schedule(now: Date) {
  const candidates: Date[] = [];
  for (let offset = -7; offset <= 7; offset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    date.setHours(10, 0, 0, 0);
    if (DROP_DAYS.includes(date.getDay())) candidates.push(date);
  }
  const latest = candidates.filter((date) => date <= now).at(-1);
  const next = candidates.find((date) => date > now) ?? candidates.at(-1)!;
  return { latest, next };
}

function formatRemaining(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days ? `${days}d ` : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function VaultDrop() {
  const [now, setNow] = useState(() => new Date());
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { latest, next } = schedule(now);
  const automaticallyOpen = Boolean(latest && now.getTime() - latest.getTime() < OPEN_WINDOW_MS);
  const open = manualOpen ?? automaticallyOpen;

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className={`relative isolate aspect-square overflow-hidden rounded-[2rem] border-4 bg-indigo-950 transition-all duration-1000 ${open ? "border-indigo-300 shadow-[0_0_90px_rgba(99,102,241,.58)]" : "border-indigo-200 shadow-[0_24px_80px_rgba(49,46,129,.28)]"}`}>
        <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle,rgba(129,140,248,.8),rgba(49,46,129,.96)_55%,rgba(15,23,42,1))] text-white transition duration-1000 ${open ? "scale-100 opacity-100" : "scale-75 opacity-50"}`}>
          <div className="absolute inset-x-10 top-0 h-3/4 bg-gradient-to-b from-white/40 via-indigo-300/20 to-transparent blur-2xl" />
          <div className="absolute h-56 w-56 animate-pulse rounded-full border border-indigo-200/40 shadow-[0_0_70px_rgba(165,180,252,.55)]" />
          <div className="absolute h-40 w-40 rounded-full border border-white/20" />
          <PackageOpen className="relative h-16 w-16 drop-shadow-[0_0_18px_rgba(255,255,255,.65)]" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] text-indigo-100">The vault is open</p>
          <p className="mt-2 text-3xl font-semibold">Drop live now</p>
        </div>

        <div className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-indigo-300/50 bg-[linear-gradient(110deg,#111827,#312e81_55%,#4338ca)] shadow-2xl transition-transform duration-[1400ms] ease-[cubic-bezier(.7,0,.2,1)] motion-reduce:duration-0 ${open ? "-translate-y-[110%]" : "translate-y-0"}`}>
          <div className="absolute inset-y-6 right-4 w-px bg-indigo-200/40" />
          <div className="absolute inset-5 rounded-l-2xl border border-indigo-300/20 bg-[repeating-linear-gradient(0deg,transparent_0_44px,rgba(165,180,252,.12)_45px_46px)]" />
          {[18, 50, 82].map((top) => <span key={top} className="absolute left-4 h-2 w-2 rounded-full bg-indigo-300/70 shadow-[0_0_10px_rgba(165,180,252,.8)]" style={{ top: `${top}%` }} />)}
        </div>
        <div className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-indigo-300/50 bg-[linear-gradient(70deg,#4338ca,#312e81_45%,#111827)] shadow-2xl transition-transform delay-100 duration-[1500ms] ease-[cubic-bezier(.7,0,.2,1)] motion-reduce:duration-0 ${open ? "-translate-y-[110%]" : "translate-y-0"}`}>
          <div className="absolute inset-y-6 left-4 w-px bg-indigo-200/40" />
          <div className="absolute inset-5 rounded-r-2xl border border-indigo-300/20 bg-[repeating-linear-gradient(0deg,transparent_0_44px,rgba(165,180,252,.12)_45px_46px)]" />
          {[18, 50, 82].map((top) => <span key={top} className="absolute right-4 h-2 w-2 rounded-full bg-indigo-300/70 shadow-[0_0_10px_rgba(165,180,252,.8)]" style={{ top: `${top}%` }} />)}
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-700 motion-reduce:duration-0 ${open ? "-translate-y-24 scale-75 opacity-0" : "translate-y-0 scale-100 opacity-100"}`}>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-300 bg-indigo-950 shadow-[0_0_40px_rgba(129,140,248,.55)]">
              <LockKeyhole className="h-10 w-10 text-indigo-200" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Vault opens in</p>
            <p className="mt-2 font-mono text-2xl font-semibold">{formatRemaining(next.getTime() - now.getTime())}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Doors open automatically at drop time.</p>
        <button type="button" onClick={() => setManualOpen(!open)} className="shrink-0 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
          {open ? "Lower doors" : "Raise doors"}
        </button>
      </div>
    </div>
  );
}
