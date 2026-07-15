"use client";

import { useEffect, useState } from "react";

type Props = {
  /** called when the drop moment arrives */
  onOpen?: () => void;
  /** override for demos */
  debugOpenAtMsFromNow?: number;
};

function getNextDrop(): Date {
  const now = new Date();
  // JS getDay(): Sun=0..Sat=6
  const DROP_DAYS = [2, 4, 6]; // Tue, Thu, Sat
  const DROP_HOUR = 10;

  for (let i = 1; i <= 8; i++) {
    const candidate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    if (DROP_DAYS.includes(candidate.getDay())) {
      candidate.setHours(DROP_HOUR, 0, 0, 0);
      if (candidate > now) return candidate;
    }
  }

  const fallback = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  fallback.setHours(10, 0, 0, 0);
  return fallback;
}

export function VaultDoors({ onOpen, debugOpenAtMsFromNow }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) return;

    const t = debugOpenAtMsFromNow != null ? debugOpenAtMsFromNow : getNextDrop().getTime() - Date.now();
    const timeout = window.setTimeout(() => {
      setOpen(true);
      onOpen?.();
    }, Math.max(0, t));

    return () => window.clearTimeout(timeout);
  }, [open, debugOpenAtMsFromNow, onOpen]);

  return (
    <div className="relative z-40">
      {/* Trigger overlay for accessibility */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[92%] -translate-x-1/2" />

      <div
        aria-hidden={!open}
        className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-sm shadow-[0_0_60px_rgba(245,158,11,0.08)]"
      >
        <div className="relative overflow-hidden rounded-[1.8rem] bg-black/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.35),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(0,0,0,0.65))]" />

          {/* Doors */}
          <div className="relative grid grid-cols-2">
            <div
              className={
                "h-[170px] origin-left border-r border-white/10 transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] " +
                (open ? "-translate-x-full" : "translate-x-0")
              }
            >
              <div className="h-full bg-[linear-gradient(180deg,rgba(245,158,11,0.15),rgba(0,0,0,0.7))]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border border-amber-400/30 bg-amber-500/10" />
              </div>
            </div>

            <div
              className={
                "h-[170px] origin-right border-l border-white/10 transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] " +
                (open ? "translate-x-full" : "translate-x-0")
              }
            >
              <div className="h-full bg-[linear-gradient(180deg,rgba(245,158,11,0.15),rgba(0,0,0,0.7))]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border border-amber-400/30 bg-amber-500/10" />
              </div>
            </div>
          </div>

          {/* Center message */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-1 text-amber-200 text-sm">
              {open ? "Vault Open" : "Secured Vault"}
            </div>
            <div className="mt-3 text-white font-semibold">
              {open ? "The menu is unlocked — shop the drop." : "Next drop opens at 10:00 AM"}
            </div>
          </div>

          {/* Glow when open */}
          {open && (
            <div className="pointer-events-none absolute inset-0 animate-pulse [background:radial-gradient(circle_at_center,rgba(245,158,11,0.35),transparent_60%)]" />
          )}
        </div>
      </div>
    </div>
  );
}

