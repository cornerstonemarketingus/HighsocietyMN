export default function GamesPage() {
  const games = [
    "Daily Spin (1-50 SILVER)",
    "Cannabis Quiz (10-30 SILVER)",
    "Purchase Streak Bonus",
    "Referral Race",
    "Collector Challenge",
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Mini-Games Hub</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game) => (
          <div key={game} className="card">
            <p className="font-semibold text-emerald-900">{game}</p>
            <p className="mt-1 text-sm text-emerald-700">Play instantly and earn SILVER tokens.</p>
            <button className="btn mt-3 text-sm">Play</button>
          </div>
        ))}
      </div>
    </div>
  );
}
