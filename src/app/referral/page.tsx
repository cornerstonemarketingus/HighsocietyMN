export default function ReferralPage() {
  const code = "HSMN-50BONUS";

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Referral Dashboard</h1>
      <section className="card space-y-3">
        <p className="text-sm text-emerald-700">Share your code. Both users get 50 GOLD points after first completed purchase.</p>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-700">Your link</p>
          <p className="text-lg font-black text-emerald-900">/ref/{code}</p>
        </div>
        <div className="flex gap-2 text-sm">
          <button className="btn">Copy link</button>
          <button className="rounded-xl border border-emerald-200 px-4 py-2 font-semibold">Share email</button>
          <button className="rounded-xl border border-emerald-200 px-4 py-2 font-semibold">Generate QR</button>
        </div>
      </section>
    </div>
  );
}
