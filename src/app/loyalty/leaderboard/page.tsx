export default function LeaderboardPage() {
  const leaders = [
    ["northstar_green", 6220],
    ["mnflowerfan", 5340],
    ["highsocietyvip", 4890],
    ["you", 1280],
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Leaderboard</h1>
      <div className="card">
        {leaders.map(([name, points], index) => (
          <div key={String(name)} className="flex items-center justify-between border-b border-emerald-100 py-2 last:border-b-0">
            <p className="font-semibold text-emerald-900">#{index + 1} {name}</p>
            <p className="font-bold text-emerald-800">{points} GOLD</p>
          </div>
        ))}
      </div>
    </div>
  );
}
