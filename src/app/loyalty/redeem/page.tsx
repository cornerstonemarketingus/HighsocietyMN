export default function RedeemPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Redeem Rewards</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {["$10 Off (1000 GOLD)", "VIP Event Pass (2000 GOLD)", "5 SILVER → 50 GOLD"].map((reward) => (
          <div key={reward} className="card">
            <p className="font-semibold text-emerald-900">{reward}</p>
            <button className="btn mt-3 text-sm">Redeem</button>
          </div>
        ))}
      </div>
    </div>
  );
}
