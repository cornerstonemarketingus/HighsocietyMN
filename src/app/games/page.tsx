"use client";

import { useEffect, useState } from "react";
import { DinoDefenseGame } from "@/components/DinoDefenseGame";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function GamesPage() {
  const [balance, setBalance] = useState({ points: 0, tokens: 0 });

  useEffect(() => {
    fetch("/api/points")
      .then((response) => response.ok ? response.json() : { points: 0, tokens: 0 })
      .then(setBalance);
  }, []);

  return (
    <div className="aurora-page min-h-screen overflow-hidden text-white">
      <Header />
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-80 h-96 w-96 rounded-full bg-violet-500/14 blur-[130px]" />

        <div className="relative mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300/75">High Society Arcade</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">One game.<br /><span className="aurora-text">One more run.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/52">A fast, skill-based survival game designed for mobile and desktop. No slots, guessing games, wagering, or cannabis prizes.</p>
          </div>
          <div className="glass-card flex gap-6 rounded-2xl px-5 py-4 text-sm">
            <div><p className="text-white/38">Member points</p><p className="mt-1 font-mono text-lg text-white">{balance.points}</p></div>
            <div><p className="text-white/38">Play tokens</p><p className="mt-1 font-mono text-lg text-white">{balance.tokens}</p></div>
          </div>
        </div>

        <div className="relative">
          <DinoDefenseGame />
        </div>

        <section className="relative mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Skill first", "Your score comes from movement, timing, and aim—not a randomized wager."],
            ["Free play", "Chrome Ranger does not spend tokens and requires no purchase."],
            ["Responsible rewards", "Points and tokens have no cash value and cannot be redeemed for cannabis or THC products."],
          ].map(([title, copy]) => (
            <div key={title} className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">{copy}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
