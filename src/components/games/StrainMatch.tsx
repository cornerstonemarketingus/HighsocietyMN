"use client";

import { useMemo, useState } from "react";
import { Crown, Flame, Leaf, RotateCcw, Sparkles } from "lucide-react";

const symbols = ["Crown", "Flame", "Leaf", "Sparkles"] as const;
const icons = { Crown, Flame, Leaf, Sparkles };

function shuffledDeck(round: number) {
  return [...symbols, ...symbols]
    .map((symbol, index) => ({ id: `${symbol}-${index}`, symbol, order: Math.sin((index + 1) * (round + 3)) }))
    .sort((a, b) => a.order - b.order);
}

export function StrainMatch() {
  const [round, setRound] = useState(1);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const deck = useMemo(() => shuffledDeck(round), [round]);
  const won = matched.length === symbols.length;

  function choose(id: string, symbol: string) {
    if (open.includes(id) || matched.includes(symbol) || open.length === 2) return;
    const next = [...open, id];
    setOpen(next);
    if (next.length !== 2) return;
    setMoves(value => value + 1);
    const first = deck.find(card => card.id === next[0]);
    if (first?.symbol === symbol) {
      window.setTimeout(() => { setMatched(value => [...value, symbol]); setOpen([]); }, 350);
    } else {
      window.setTimeout(() => setOpen([]), 750);
    }
  }

  function restart() {
    setRound(value => value + 1);
    setOpen([]);
    setMatched([]);
    setMoves(0);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="border border-[#e5a12b]/30 bg-[#080806] p-4 sm:p-7">
        <div className="mb-6 flex items-center justify-between"><div><p className="eyebrow">Memory chamber</p><h2 className="mt-2 text-2xl font-medium">Strain Match</h2></div><p className="font-mono text-sm text-[#ffc263]">{moves} moves</p></div>
        <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-label="Strain Match card grid">
          {deck.map(card => {
            const revealed = open.includes(card.id) || matched.includes(card.symbol);
            const Icon = icons[card.symbol];
            return <button key={card.id} onClick={() => choose(card.id, card.symbol)} aria-label={revealed ? card.symbol : "Hidden card"} className={`flex aspect-[3/4] items-center justify-center border transition duration-300 ${revealed ? "border-[#e5a12b] bg-[#e5a12b]/15 text-[#ffc263]" : "border-white/10 bg-[#15130e] text-transparent hover:border-[#e5a12b]/60"}`}><Icon className="h-7 w-7 sm:h-10 sm:w-10" /></button>;
          })}
        </div>
        {won && <div className="mt-6 flex items-center justify-between border border-[#e5a12b]/35 bg-[#e5a12b]/10 p-4"><div><p className="font-semibold text-white">Chamber cleared</p><p className="mt-1 text-xs text-zinc-400">You matched the collection in {moves} moves.</p></div><button onClick={restart} className="inline-flex h-10 items-center gap-2 bg-[#e5a12b] px-4 text-xs font-semibold text-black"><RotateCcw className="h-4 w-4" /> Again</button></div>}
      </div>
      <aside className="border-t border-[#e5a12b]/30 pt-5"><p className="eyebrow">How to play</p><div className="mt-6 space-y-5 text-sm leading-6 text-zinc-400"><p>Open two cards at a time and match every symbol in the chamber.</p><p>Matched pairs remain revealed. Clear all four pairs in as few moves as possible.</p></div><button onClick={restart} className="mt-8 inline-flex h-10 items-center gap-2 border border-white/15 px-4 text-xs text-white hover:border-[#e5a12b]"><RotateCcw className="h-4 w-4" /> New board</button></aside>
    </div>
  );
}
