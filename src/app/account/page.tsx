"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Order = { id: string; orderNumber: string; status: string; total: number; createdAt: string };
type Rewards = { referralCode: string; referralCount: number; points: number; tokens: number };

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rewards, setRewards] = useState<Rewards | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.ok ? r.json() : { orders: [] }),
      fetch("/api/referrals").then((r) => r.ok ? r.json() : null),
    ]).then(([orderData, rewardData]) => {
      setOrders(orderData.orders ?? []);
      setRewards(rewardData);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Member account</p>
          <h1 className="mt-2 text-4xl font-semibold">Your High Society</h1>
        </div>
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Loyalty points</p><p className="mt-2 text-3xl font-semibold">{rewards?.points ?? 0}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Game tokens</p><p className="mt-2 text-3xl font-semibold">{rewards?.tokens ?? 0}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Successful referrals</p><p className="mt-2 text-3xl font-semibold">{rewards?.referralCount ?? 0}</p></div>
        </section>
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold">Share your referral code</h2>
          <p className="mt-2 text-slate-600">Friends can enter this code when they register. You earn 250 points for every successful referral.</p>
          <code className="mt-4 inline-block rounded-xl bg-white px-4 py-3 text-lg font-bold text-indigo-700">{rewards?.referralCode ?? "Loading…"}</code>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Order history</h2>
          <div className="mt-5 divide-y divide-slate-100">
            {orders.length === 0 && <p className="py-6 text-slate-500">No orders yet.</p>}
            {orders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div><p className="font-medium">{order.orderNumber}</p><p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{order.status}</span>
                <p className="font-semibold">${order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
