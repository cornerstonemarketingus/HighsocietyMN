"use client";

import { useState } from "react";
import { SpinWheel } from "@/components/SpinWheel";
import { VaultRun } from "@/components/games/VaultRun";
import { StrainMatch } from "@/components/games/StrainMatch";

export function GameHub({ eligible }: { eligible: boolean }) {
  const [game, setGame] = useState<"run" | "wheel" | "match">("run");
  return <div>
    <div className="mb-8 inline-flex border border-white/10 bg-black/30 p-1" role="tablist" aria-label="Select a game">
      <button role="tab" aria-selected={game === "run"} onClick={() => setGame("run")} className={`px-5 py-2.5 text-sm ${game === "run" ? "bg-[#e5a12b] font-semibold text-black" : "text-zinc-400"}`}>Vault Run</button>
      <button role="tab" aria-selected={game === "wheel"} onClick={() => setGame("wheel")} className={`px-5 py-2.5 text-sm ${game === "wheel" ? "bg-[#e5a12b] font-semibold text-black" : "text-zinc-400"}`}>Reward Wheel</button>
      <button role="tab" aria-selected={game === "match"} onClick={() => setGame("match")} className={`px-5 py-2.5 text-sm ${game === "match" ? "bg-[#e5a12b] font-semibold text-black" : "text-zinc-400"}`}>Strain Match</button>
    </div>
    {game === "run" ? <VaultRun /> : game === "wheel" ? <SpinWheel eligible={eligible} /> : <StrainMatch />}
  </div>;
}
