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
  const next = new Date(now);

  for (let i = 1; i <= 7; i++) {
    next.setDate(now.getDate() + i);
    if (DROP_DAYS.includes(next.getDay())) {
      next.setHours(DROP_HOUR, 0, 0, 0);
      if (next > now) return next;
    }
  }

  // Fallback: 7 days out
  next.setDate(now.getDate() + 7);
  next.setHours(DROP_HOUR, 0, 0, 0);
  return next;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function formatDropLabel(date: Date): string {
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const d = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${day}, ${d}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function DropTimer() {
  const [open, setOpen] = useState(false);
  // Lazy-initialize so the first render already has correct values (avoids setState in effect)
  const [nextDrop] = useState<Date>(getNextDrop);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(getNextDrop()));

  useEffect(() => {
    const id = setInterval(() => {
      const drop = getNextDrop();
      setTimeLeft(calcTimeLeft(drop));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const dropLabel = formatDropLabel(nextDrop);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-colors text-amber-400 text-sm font-medium"
        aria-label="Toggle drop timer"
      >
        <Zap className="h-3.5 w-3.5 text-amber-400" />
        <span className="hidden sm:inline">Next Drop:</span>
        <span className="font-mono tabular-nums text-amber-300">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/10 bg-zinc-900 shadow-xl z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-900/40 to-black/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-amber-400" />
              <h3 className="text-white font-semibold text-sm">Next Drop</h3>
            </div>
            <p className="text-amber-300 text-xs mb-3">{dropLabel} @ 10:00 AM</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center rounded-lg bg-black/40 py-2">
                  <span className="text-xl font-bold font-mono tabular-nums text-amber-400">
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
              className="block w-full text-center rounded-lg bg-amber-500 text-black text-sm font-semibold py-2 hover:bg-amber-400 transition-colors"
            >
              See Upcoming Drops →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
