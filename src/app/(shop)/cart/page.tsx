"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Trash2 } from "lucide-react";

type CartItem = { id: string; quantity: number; product: { name: string; price: number; images: string[] } };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => fetch("/api/cart").then((r) => r.ok ? r.json() : { items: [] }).then((data) => { setItems(data.items ?? []); setLoading(false); });
  useEffect(() => { load(); }, []);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  async function remove(itemId: string) {
    await fetch("/api/cart", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId }) });
    await load();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold">Your bag</h1>
        {loading ? <p className="mt-8 text-slate-500">Loading…</p> : items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-14 w-14 text-indigo-600" />
            <p className="mt-5 text-lg text-slate-600">Your bag is empty.</p>
            <Link href="/products"><Button className="mt-5">Browse products</Button></Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
              {items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-6">
                <div><h2 className="font-semibold">{item.product.name}</h2><p className="text-sm text-slate-500">Quantity {item.quantity}</p></div>
                <div className="flex items-center gap-4"><p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p><button onClick={() => remove(item.id)} aria-label={`Remove ${item.product.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>
              </div>)}
            </div>
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between text-lg font-semibold"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <p className="mt-2 text-sm text-slate-500">Taxes, scheduling, and member discounts are calculated at checkout.</p>
              <Link href="/checkout"><Button className="mt-5 w-full" size="lg">Schedule checkout</Button></Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
