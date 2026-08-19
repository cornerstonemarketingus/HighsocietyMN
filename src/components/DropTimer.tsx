"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import Link from "next/link";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
// Drop days: 2=Tuesday, 4=Thursday, 6=Saturday
const DROP_DAYS = [2, 4, 6];
const DROP_HOUR = 10; // 10am local time

function getNextDrop(): Date {
  const now = new Date();
  const dropDays = DROP_DAYS;

  for (let i = 1; i <= 7; i++) {
    const candidate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    if (dropDays.includes(candidate.getDay())) {
      candidate.setHours(DROP_HOUR, 0, 0, 0);
      if (candidate > now) return candidate;
    }
  }

  // Fallback: 7 days out
  const fallback = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  fallback.setHours(DROP_HOUR, 0, 0, 0);
  return fallback;
}

function calcTimeLeft(target: Date): TimeLeft {
  // Ensure both server render (if any) and client render compute the same values.
  // Use the provided target and a stable "now" captured once.
  // Note: DropTimer is client-only, but hydration mismatch was still occurring.
  const now = Date.now();
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function formatDropLabel(): string {
  // Avoid hydration mismatches: keep label stable (no locale/zone formatting during render).
  // Render a fixed label; timeLeft is the only dynamic portion.
  return "Next Drop";
}


function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function DropTimer() {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => {
      const drop = getNextDrop();
      setTimeLeft(calcTimeLeft(drop));
    };

    const initialId = window.setTimeout(update, 0);
    const intervalId = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
    };
  }, []);

  const dropLabel = formatDropLabel();

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-blue-400 text-sm font-medium"
        aria-label="Toggle drop timer"
        aria-expanded={open}
        aria-controls="drop-timer-details"
      >
        <Zap className="h-3.5 w-3.5 text-blue-400" />
        <span className="hidden sm:inline">Next Drop:</span>
        <span className="font-mono tabular-nums text-blue-300">
          {timeLeft && timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft ? `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}` : "--:--:--"}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {open && (
        <div
          id="drop-timer-details"
          className="relative z-10 mt-3 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-72"
        >
          <div className="bg-gradient-to-r from-blue-900/40 to-black/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Next Drop</h3>
            </div>
            <p className="text-blue-300 text-xs mb-3">{dropLabel} @ 10:00 AM</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Days", value: timeLeft?.days ?? 0 },
                { label: "Hrs", value: timeLeft?.hours ?? 0 },
                { label: "Min", value: timeLeft?.minutes ?? 0 },
                { label: "Sec", value: timeLeft?.seconds ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center rounded-lg bg-black/40 py-2">
                  <span className="text-xl font-bold font-mono tabular-nums text-blue-400">
                    {pad(value)}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 p-3 space-y-1.5">
            <p className="text-xs text-gray-400 px-1">Drops every Tue · Thu · Sat @ 10am</p>
            <Link
              href="/drops"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-lg bg-blue-500 text-white text-sm font-semibold py-2 hover:bg-blue-400 transition-colors"
            >
              See Upcoming Drops →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
