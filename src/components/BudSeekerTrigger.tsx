"use client";

import { Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

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
          ? "inline-flex items-center gap-2 rounded-full border-2 border-black bg-green-500 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-green-400"
          : "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-8 text-base font-medium text-slate-950 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-500/10 hover:text-green-700"
      }
      aria-label="Open Bud Seeker"
    >
      {compact ? <BrandMark className="h-5 w-5 text-black" /> : <Sparkles className="h-5 w-5" />}
      Bud Seeker
    </button>
  );
}
