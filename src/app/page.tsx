import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-br from-emerald-950 to-emerald-800 text-emerald-50">
        <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">High Society MN</p>
        <h1 className="mt-3 text-4xl font-black">AAA SaaS Cannabis Dispensary Platform</h1>
        <p className="mt-4 max-w-2xl text-emerald-100">
          Live demo includes product discovery, checkout with scheduling, Budtender AI, forum, blog, loyalty games,
          referrals, and marketing automation APIs.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-emerald-950" href="/products">Shop Products</Link>
          <Link className="rounded-xl border border-emerald-300 px-4 py-2 font-semibold" href="/community">Join Community</Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["/checkout", "Schedule Pickup/Delivery"],
          ["/loyalty", "Dual Token Loyalty"],
          ["/blog", "AI Blog & Marketing"],
        ].map(([href, title]) => (
          <Link key={href} href={href} className="card transition hover:-translate-y-0.5">
            <h2 className="text-lg font-bold text-emerald-900">{title}</h2>
          </Link>
        ))}
      </section>
    </div>
  );
}
