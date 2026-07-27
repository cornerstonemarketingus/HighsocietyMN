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
      <div className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-white/15 bg-[radial-gradient(circle_at_12%_22%,rgba(0,245,160,.17),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(124,58,237,.16),transparent_34%),linear-gradient(115deg,rgba(5,5,5,.98),rgba(9,16,21,.94))] shadow-[20px_0_90px_rgba(0,0,0,.65)] backdrop-blur-[32px] transition-transform duration-[1600ms] ease-[cubic-bezier(.72,0,.18,1)] motion-reduce:duration-0 ${doorMotion}`}>
        <div className="absolute inset-4 border border-white/[.07] sm:inset-7" />
        <div className="absolute inset-8 bg-[repeating-linear-gradient(0deg,transparent_0_70px,rgba(255,255,255,.045)_71px_72px),repeating-linear-gradient(90deg,transparent_0_100px,rgba(255,255,255,.03)_101px_102px)] sm:inset-12" />
        <div className="absolute inset-y-0 right-5 w-px bg-cyan-200/30 shadow-[0_0_32px_rgba(0,229,255,.48)]" />
        {[12, 30, 50, 70, 88].map((top) => <span key={top} className="absolute left-5 h-2.5 w-2.5 rounded-full bg-white/45 shadow-[0_0_14px_rgba(0,229,255,.38)] sm:left-8" style={{ top: `${top}%` }} />)}
      </div>

      <div className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-white/15 bg-[radial-gradient(circle_at_88%_18%,rgba(0,229,255,.17),transparent_32%),radial-gradient(circle_at_18%_78%,rgba(236,72,153,.1),transparent_32%),linear-gradient(65deg,rgba(9,16,21,.94),rgba(5,5,5,.98))] shadow-[-20px_0_90px_rgba(0,0,0,.65)] backdrop-blur-[32px] transition-transform delay-100 duration-[1700ms] ease-[cubic-bezier(.72,0,.18,1)] motion-reduce:duration-0 ${doorMotion}`}>
        <div className="absolute inset-4 border border-white/[.07] sm:inset-7" />
        <div className="absolute inset-8 bg-[repeating-linear-gradient(0deg,transparent_0_70px,rgba(255,255,255,.045)_71px_72px),repeating-linear-gradient(90deg,transparent_0_100px,rgba(255,255,255,.03)_101px_102px)] sm:inset-12" />
        <div className="absolute inset-y-0 left-5 w-px bg-cyan-200/30 shadow-[0_0_32px_rgba(0,229,255,.48)]" />
        {[12, 30, 50, 70, 88].map((top) => <span key={top} className="absolute right-5 h-2.5 w-2.5 rounded-full bg-white/45 shadow-[0_0_14px_rgba(0,229,255,.38)] sm:right-8" style={{ top: `${top}%` }} />)}
      </div>

      <div className={`absolute bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white/[.075] px-4 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_18px_70px_rgba(0,0,0,.48)] backdrop-blur-[32px] transition-all duration-700 sm:bottom-10 sm:left-auto sm:right-8 sm:px-5 ${open ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[.07] shadow-[0_0_28px_rgba(0,229,255,.28)]">
          <LockKeyhole className="h-5 w-5 text-cyan-200" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-200/80">Vault opens in</p>
          <p className="mt-1 font-mono text-sm font-semibold sm:text-base">{formatRemaining(next.getTime() - now.getTime())}</p>
        </div>
      </div>

      {open && (
        <div className="absolute bottom-5 left-4 rounded-full bg-white/[.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_0_40px_rgba(0,229,255,.2)] backdrop-blur-[32px] sm:bottom-10 sm:left-auto sm:right-8">
          Vault open · Drop live
        </div>
      )}
    </div>
  );
}
