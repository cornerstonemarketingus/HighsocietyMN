'use client';

import { Copy, Gift, Link2, Users } from 'lucide-react';
import { useState } from 'react';
import type { ReferralRecord } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';

export function ReferralDashboard({ referral }: { referral: ReferralRecord }) {
  const [copied, setCopied] = useState(false);
  const link = `https://highsocietymn.com/referral?code=${referral.code}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="page-shell py-12">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Referral rewards</p>
        <h1 className="section-heading">Invite friends. Unlock premium perks.</h1>
        <p className="max-w-3xl text-lg text-slate-300 light:text-slate-600">
          Share your unique link, track conversions, and earn credits every time a new customer completes their first order.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass-card rounded-[32px] p-8">
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 text-brand-300" />
            <h2 className="text-2xl font-semibold">Your unique referral link</h2>
          </div>
          <div className="mt-5 rounded-[24px] border border-white/10 bg-black/30 p-4 text-sm text-slate-200 light:bg-slate-100 light:text-slate-800">
            {link}
          </div>
          <Button className="mt-5" onClick={() => void copyLink()}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
        </div>
        <div className="grid gap-4">
          <div className="glass-card rounded-[28px] p-6">
            <Users className="h-5 w-5 text-brand-300" />
            <p className="mt-3 text-sm text-slate-400">Successful referrals</p>
            <p className="mt-1 text-4xl font-bold">{referral.referrals}</p>
          </div>
          <div className="glass-card rounded-[28px] p-6">
            <Gift className="h-5 w-5 text-brand-300" />
            <p className="mt-3 text-sm text-slate-400">Rewards earned</p>
            <p className="mt-1 text-4xl font-bold">${referral.rewardsEarned}</p>
            <p className="mt-2 text-sm text-brand-200">${referral.pendingRewards} pending after current invites convert.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
