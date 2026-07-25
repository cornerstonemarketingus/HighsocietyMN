"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type CartItem = { id: string; quantity: number; product: { name: string; price: number } };

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [scheduledAt, setScheduledAt] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    fetch("/api/cart").then((r) => r.ok ? r.json() : { items: [] }).then((data) => setItems(data.items ?? []));
    setDiscountCode(localStorage.getItem("hs_spin_code") ?? "");
  }, []);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  async function checkout() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfillmentMethod: method, scheduledAt, deliveryAddress: address, discountCode }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.url) window.location.href = data.url;
    else setError(data.error || "Checkout could not be started.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-semibold text-slate-950">Schedule and checkout</h1>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Fulfillment</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["DELIVERY", "PICKUP"] as const).map((option) => (
                  <button key={option} onClick={() => setMethod(option)}
                    className={`rounded-xl border p-4 text-left ${method === option ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-slate-200"}`}>
                    <span className="font-semibold">{option === "DELIVERY" ? "Delivery" : "Pickup"}</span>
                  </button>
                ))}
              </div>
            </div>
            {method === "DELIVERY" && <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" />}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Preferred date and time</label>
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
            <p className="text-sm text-slate-500">Delivery windows follow current High Society MN availability. The team will confirm your selected time.</p>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.quantity} × {item.product.name}</span><span>${(item.quantity * item.product.price).toFixed(2)}</span></div>)}
            </div>
            <div className="mt-5 border-t border-slate-200 pt-4"><div className="flex justify-between font-semibold"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><p className="mt-2 text-xs text-slate-500">Any wheel discount is applied securely before Stripe payment.</p></div>
            {discountCode && <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">Wheel reward: {discountCode}</p>}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <Button className="mt-5 w-full" size="lg" onClick={checkout} disabled={loading || items.length === 0 || !scheduledAt || (method === "DELIVERY" && !address)}>
              {loading ? "Opening payment…" : "Continue to secure payment"}
            </Button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
