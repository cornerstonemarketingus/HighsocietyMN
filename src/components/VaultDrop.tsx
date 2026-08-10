"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, LockOpen } from "lucide-react";

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

const RIVET_POSITIONS = [8, 26, 44, 62, 80];

export function VaultDrop() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { latest, next } = schedule(now);
  const open = Boolean(latest && now.getTime() - latest.getTime() < OPEN_WINDOW_MS);
  const doorMotion = open ? "-translate-x-full" : "translate-x-0";
  const doorMotionRight = open ? "translate-x-full" : "translate-x-0";

  return (
    <section className="relative isolate overflow-hidden border-b-2 border-black bg-black py-16 sm:py-20" aria-live="polite">
      <div className="relative mx-auto flex h-[22rem] max-w-4xl items-center justify-center sm:h-[26rem]">
        {/* Left door */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 border-r-4 border-green-500 bg-[linear-gradient(135deg,#1a1a1a_0%,#0a0a0a_60%)] transition-transform duration-[1400ms] ease-[cubic-bezier(.77,0,.18,1)] motion-reduce:duration-0 ${doorMotion}`}
        >
          <div className="absolute inset-3 border-2 border-white/10 sm:inset-6" />
          {RIVET_POSITIONS.map((top) => (
            <span key={top} className="absolute right-8 h-3 w-3 rounded-full border-2 border-black bg-green-500 sm:right-12" style={{ top: `${top}%` }} />
          ))}
        </div>

        {/* Right door */}
        <div
          className={`absolute inset-y-0 right-0 w-1/2 border-l-4 border-green-500 bg-[linear-gradient(225deg,#1a1a1a_0%,#0a0a0a_60%)] transition-transform duration-[1400ms] ease-[cubic-bezier(.77,0,.18,1)] motion-reduce:duration-0 ${doorMotionRight}`}
        >
          <div className="absolute inset-3 border-2 border-white/10 sm:inset-6" />
          {RIVET_POSITIONS.map((top) => (
            <span key={top} className="absolute left-8 h-3 w-3 rounded-full border-2 border-black bg-green-500 sm:left-12" style={{ top: `${top}%` }} />
          ))}
        </div>

        {/* Center lock + countdown, always on top */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-black bg-green-500 shadow-[0_0_0_6px_#000,0_0_60px_rgba(34,197,94,.55)] sm:h-28 sm:w-28">
            {open ? <LockOpen className="h-11 w-11 text-black sm:h-12 sm:w-12" /> : <LockKeyhole className="h-11 w-11 text-black sm:h-12 sm:w-12" />}
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.4em] text-green-400">
            {open ? "Vault open" : "Vault opens in"}
          </p>
          {open ? (
            <p className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">Drop is live</p>
          ) : (
            <p className="mt-2 font-mono text-4xl font-black tabular-nums text-white sm:text-5xl">
              {formatRemaining(next.getTime() - now.getTime())}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
