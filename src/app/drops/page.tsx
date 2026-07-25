import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DropTimer } from "@/components/DropTimer";
import { db } from "@/lib/db";
import Link from "next/link";
import { Zap, Package } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Drops | High Society MN",
  description: "New product drops every Tuesday, Thursday & Saturday at 10am. Be first in line.",
};

const DROP_DAYS = ["Tuesday", "Thursday", "Saturday"];

function getUpcomingDropDates(count = 6): Array<{ date: Date; label: string }> {
  const dropDays = [2, 4, 6]; // Tue, Thu, Sat
  const results: Array<{ date: Date; label: string }> = [];
  const now = new Date();

  for (let i = 1; results.length < count && i <= 30; i++) {
    const candidate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    if (dropDays.includes(candidate.getDay())) {
      candidate.setHours(10, 0, 0, 0);
      results.push({
        date: candidate,
        label: candidate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      });
    }
  }
  return results;
}

export default async function DropsPage() {
  const dbDrops = await db.dropEvent.findMany({
    where: { active: true, dropDate: { gte: new Date() } },
    orderBy: { dropDate: "asc" },
  });

  const upcoming = getUpcomingDropDates(6);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1.5 text-indigo-400 text-sm font-medium">
            <Zap className="h-4 w-4" /> Live Drop Schedule
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-950">
            Product <span className="text-indigo-400">Drops</span>
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Fresh products drop every <strong className="text-slate-950">Tuesday</strong>,{" "}
            <strong className="text-slate-950">Thursday</strong>, and{" "}
            <strong className="text-slate-950">Saturday</strong> at 10:00 AM.
          </p>
          {/* Live countdown */}
          <div className="flex justify-center">
            <DropTimer />
          </div>
        </div>

        {/* Drop schedule banner */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {DROP_DAYS.map((day) => (
            <div
              key={day}
              className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-900/20 to-black/60 p-6 text-center"
            >
              <Zap className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-slate-950 font-bold text-lg">{day}</p>
              <p className="text-slate-600 text-sm mt-1">@ 10:00 AM</p>
            </div>
          ))}
        </div>

        {/* Featured/admin drops */}
        {dbDrops.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-950 mb-6">Featured Drops</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dbDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded-2xl border border-indigo-500/40 bg-indigo-900/10 p-6 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs text-indigo-400 font-medium uppercase tracking-wide">
                      Featured Drop
                    </span>
                  </div>
                  <h3 className="text-slate-950 font-bold text-lg">{drop.title}</h3>
                  {drop.description && (
                    <p className="text-slate-600 text-sm">{drop.description}</p>
                  )}
                  <p className="text-indigo-300 text-sm font-medium">
                    {new Date(drop.dropDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming dates */}
        <section>
          <h2 className="text-2xl font-bold text-slate-950 mb-6">Upcoming Drop Dates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(({ date, label }, i) => (
              <div
                key={date.toISOString()}
                className={`flex items-center gap-4 rounded-xl border p-4 ${
                  i === 0
                    ? "border-indigo-500/60 bg-indigo-500/10"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    i === 0 ? "bg-indigo-500" : "bg-indigo-50"
                  }`}
                >
                  <Zap className={`h-5 w-5 ${i === 0 ? "text-black" : "text-indigo-500"}`} />
                </div>
                <div>
                  <p className={`font-medium text-sm ${i === 0 ? "text-indigo-400" : "text-slate-950"}`}>
                    {i === 0 ? "⚡ NEXT DROP" : label}
                  </p>
                  {i === 0 && <p className="text-xs text-slate-600">{label}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-black p-10 text-center space-y-5">
          <Package className="h-12 w-12 text-indigo-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-950">Never Miss a Drop</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Subscribe to our newsletter for early access announcements and exclusive drop previews — plus 10% off your first order.
          </p>
          <Link
            href="/#newsletter"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 text-black px-8 py-3 font-semibold hover:bg-indigo-400 transition-colors"
          >
            Get Drop Alerts
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
