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
        className="flex items-center gap-2 rounded-lg bg-white/[.065] px-3 py-1.5 text-sm font-medium text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-[30px] transition-colors hover:bg-white/[.11] hover:text-white"
        aria-label="Toggle drop timer"
      >
        <Zap className="h-3.5 w-3.5 text-cyan-300" />
        <span className="hidden sm:inline">Next Drop:</span>
        <span className="font-mono tabular-nums text-cyan-200">
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
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/[.09] bg-[#090d12]/90 text-white shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-[32px]">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.13),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,.14),transparent_50%)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">Next Drop</h3>
            </div>
            <p className="mb-3 text-xs text-cyan-200/70">{dropLabel} @ 10:00 AM</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center rounded-lg bg-white/[.055] py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                  <span className="font-mono text-xl font-bold tabular-nums text-cyan-200">
                    {pad(value)}
                  </span>
                  <span className="mt-0.5 text-xs text-white/38">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 border-t border-white/[.07] p-3">
            <p className="px-1 text-xs text-white/42">Drops every Tue · Thu · Sat @ 10am</p>
            <Link
              href="/drops"
              onClick={() => setOpen(false)}
              className="block w-full rounded-lg bg-white py-2 text-center text-sm font-semibold text-[#050505] transition-colors hover:bg-cyan-50"
            >
              See Upcoming Drops →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
