import Link from "next/link";

export default function LoyaltyPage() {
  const gold = 1280;
  const silver = 94;
  const tier = "Silver";
  const toNext = 720;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Loyalty Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm">GOLD Points</p><p className="text-3xl font-black text-amber-500">{gold}</p></div>
        <div className="card"><p className="text-sm">SILVER Tokens</p><p className="text-3xl font-black text-slate-500">{silver}</p></div>
        <div className="card"><p className="text-sm">Tier</p><p className="text-3xl font-black text-emerald-800">{tier}</p><p className="text-xs text-emerald-600">{toNext} points to Gold</p></div>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <Link href="/loyalty/redeem" className="card font-semibold">Redeem rewards</Link>
        <Link href="/loyalty/games" className="card font-semibold">Play mini-games</Link>
        <Link href="/loyalty/leaderboard" className="card font-semibold">Leaderboard</Link>
      </section>
    </div>
  );
}
