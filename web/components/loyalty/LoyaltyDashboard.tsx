'use client';

import { Gift, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';
import type { LoyaltyRecord } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';

const rewards = [50, 75, 100, 150, 200];

export function LoyaltyDashboard({ loyalty }: { loyalty: LoyaltyRecord }) {
  const [points, setPoints] = useState(loyalty.points);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const progress = Math.min(100, (points / loyalty.nextRewardAt) * 100);

  const spinWheel = () => {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setSpinResult(reward);
    setPoints((value) => value + reward);
  };

  return (
    <section className="page-shell py-12">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Members club</p>
        <h1 className="section-heading">Luxury loyalty, designed for repeat discovery</h1>
        <p className="max-w-3xl text-lg text-slate-300 light:text-slate-600">
          Track points, redeem rewards, spin for bonus drops, and compete on the local leaderboard.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="glass-card rounded-[32px] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Points balance</p>
              <h2 className="mt-3 text-5xl font-bold">{points.toLocaleString()}</h2>
              <p className="mt-2 text-slate-400">Tier: {loyalty.tier}</p>
            </div>
            <div className="rounded-[28px] border border-brand-500/30 bg-brand-500/10 px-5 py-4 text-right">
              <p className="text-sm text-brand-100">Next reward unlock</p>
              <p className="text-2xl font-bold text-brand-300">{loyalty.nextRewardAt - points} pts</p>
            </div>
          </div>
          <div className="mt-6 h-3 rounded-full bg-white/10">
            <div className="h-3 rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {loyalty.perks.map((perk) => (
              <div key={perk} className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <Sparkles className="mb-3 h-5 w-5 text-brand-300" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-brand-300" />
              <h3 className="text-xl font-semibold">Mini-games</h3>
            </div>
            <p className="mt-3 text-sm text-slate-400">Spin once per day for bonus rewards or check in to keep your streak alive.</p>
            <Button className="mt-5 w-full" onClick={spinWheel}>Spin the wheel</Button>
            <Button variant="ghost" className="mt-3 w-full" onClick={() => setPoints((value) => value + 25)}>Daily check-in (+25)</Button>
            {spinResult ? <p className="mt-4 text-sm text-brand-200">Nice — you just earned {spinResult} bonus points.</p> : null}
          </div>
          <div className="glass-card rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-brand-300" />
              <h3 className="text-xl font-semibold">Leaderboard</h3>
            </div>
            <div className="mt-4 space-y-3">
              {loyalty.leaderboard.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
                  <span>{index + 1}. {entry.name}</span>
                  <span className="font-semibold text-brand-200">{entry.points.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-[32px] p-6">
            <h3 className="text-xl font-semibold">Redeem points</h3>
            <div className="mt-4 grid gap-3">
              {['$10 off at 500 pts', 'Free pre-roll at 750 pts', 'VIP drop access at 1,200 pts'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
