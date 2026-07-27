"use client";

import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";

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

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { latest, next } = schedule(now);
  const open = Boolean(latest && now.getTime() - latest.getTime() < OPEN_WINDOW_MS);
  const doorMotion = open ? "-translate-y-[105%]" : "translate-y-0";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-live="polite">
      <div className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-blue-300/40 bg-[linear-gradient(115deg,#030712_0%,#071738_52%,#123b83_100%)] shadow-[20px_0_80px_rgba(0,0,0,.55)] transition-transform duration-[1600ms] ease-[cubic-bezier(.72,0,.18,1)] motion-reduce:duration-0 ${doorMotion}`}>
        <div className="absolute inset-4 border border-blue-300/15 sm:inset-7" />
        <div className="absolute inset-8 bg-[repeating-linear-gradient(0deg,transparent_0_70px,rgba(147,197,253,.09)_71px_72px),repeating-linear-gradient(90deg,transparent_0_100px,rgba(147,197,253,.06)_101px_102px)] sm:inset-12" />
        <div className="absolute inset-y-0 right-5 w-px bg-blue-200/40 shadow-[0_0_28px_rgba(96,165,250,.7)]" />
        {[12, 30, 50, 70, 88].map((top) => <span key={top} className="absolute left-5 h-2.5 w-2.5 rounded-full bg-blue-300/60 shadow-[0_0_12px_rgba(96,165,250,.7)] sm:left-8" style={{ top: `${top}%` }} />)}
      </div>

      <div className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-blue-300/40 bg-[linear-gradient(65deg,#123b83_0%,#071738_48%,#030712_100%)] shadow-[-20px_0_80px_rgba(0,0,0,.55)] transition-transform delay-100 duration-[1700ms] ease-[cubic-bezier(.72,0,.18,1)] motion-reduce:duration-0 ${doorMotion}`}>
        <div className="absolute inset-4 border border-blue-300/15 sm:inset-7" />
        <div className="absolute inset-8 bg-[repeating-linear-gradient(0deg,transparent_0_70px,rgba(147,197,253,.09)_71px_72px),repeating-linear-gradient(90deg,transparent_0_100px,rgba(147,197,253,.06)_101px_102px)] sm:inset-12" />
        <div className="absolute inset-y-0 left-5 w-px bg-blue-200/40 shadow-[0_0_28px_rgba(96,165,250,.7)]" />
        {[12, 30, 50, 70, 88].map((top) => <span key={top} className="absolute right-5 h-2.5 w-2.5 rounded-full bg-blue-300/60 shadow-[0_0_12px_rgba(96,165,250,.7)] sm:right-8" style={{ top: `${top}%` }} />)}
      </div>

      <div className={`absolute bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-blue-200/30 bg-[#030918]/90 px-4 py-3 text-white shadow-[0_18px_60px_rgba(0,0,0,.5)] backdrop-blur-xl transition-all duration-700 sm:bottom-10 sm:left-auto sm:right-8 sm:px-5 ${open ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-300/50 bg-blue-500/10 shadow-[0_0_24px_rgba(59,130,246,.45)]">
          <LockKeyhole className="h-5 w-5 text-blue-200" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-300">Vault opens in</p>
          <p className="mt-1 font-mono text-sm font-semibold sm:text-base">{formatRemaining(next.getTime() - now.getTime())}</p>
        </div>
      </div>

      {open && (
        <div className="absolute bottom-5 left-4 rounded-full border border-blue-200/30 bg-blue-600/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_35px_rgba(59,130,246,.55)] backdrop-blur-md sm:bottom-10 sm:left-auto sm:right-8">
          Vault open · Drop live
        </div>
      )}
    </div>
  );
}
