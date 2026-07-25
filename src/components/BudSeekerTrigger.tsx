"use client";

import { Search, Sparkles } from "lucide-react";

interface BudSeekerTriggerProps {
  compact?: boolean;
}

export function BudSeekerTrigger({ compact = false }: BudSeekerTriggerProps) {
  function openBudSeeker() {
    window.dispatchEvent(new CustomEvent("bud-seeker:open"));
  }

  return (
    <button
      type="button"
      onClick={openBudSeeker}
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 transition-colors hover:bg-indigo-500/20"
          : "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-8 text-base font-medium text-slate-950 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-200"
      }
      aria-label="Open Bud Seeker product finder"
    >
      {compact ? <Search className="h-4 w-4" /> : <Sparkles className="h-5 w-5" />}
      Find My Bud
    </button>
  );
}
