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
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { latest, next } = schedule(now);
  const open = Boolean(latest && now.getTime() - latest.getTime() < OPEN_WINDOW_MS);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border-4 border-indigo-200 bg-indigo-950 shadow-[0_24px_80px_rgba(49,46,129,0.28)]">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle,rgba(99,102,241,0.55),rgba(30,27,75,0.95)_58%)] text-white">
          <PackageOpen className="h-16 w-16" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] text-indigo-100">The vault is open</p>
          <p className="mt-2 text-3xl font-semibold">Drop live now</p>
        </div>
        <div className={`absolute inset-y-0 left-0 w-1/2 border-r border-indigo-300/40 bg-[linear-gradient(90deg,#1e1b4b,#312e81)] transition-transform duration-1000 ease-in-out ${open ? "-translate-x-full" : "translate-x-0"}`}>
          <div className="absolute inset-y-8 right-5 w-px bg-indigo-300/30" />
        </div>
        <div className={`absolute inset-y-0 right-0 w-1/2 border-l border-indigo-300/40 bg-[linear-gradient(90deg,#312e81,#1e1b4b)] transition-transform duration-1000 ease-in-out ${open ? "translate-x-full" : "translate-x-0"}`}>
          <div className="absolute inset-y-8 left-5 w-px bg-indigo-300/30" />
        </div>
        {!open && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-300 bg-indigo-950 shadow-xl">
              <LockKeyhole className="h-10 w-10 text-indigo-200" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Vault opens in</p>
            <p className="mt-2 font-mono text-2xl font-semibold">{formatRemaining(next.getTime() - now.getTime())}</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">Doors open automatically at 10am every Tuesday, Thursday, and Saturday.</p>
    </div>
  );
}
