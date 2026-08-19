"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, LoaderCircle, LockKeyhole, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/events";

type CartItem = { id: string; quantity: number; product: { name: string; price: number; inStock: boolean; published: boolean; stockQuantity: number } };

export function CheckoutClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/cart", { cache: "no-store" });
    if (response.status === 401) { router.replace("/login?callbackUrl=/checkout"); return; }
    const data = await response.json() as { items?: CartItem[]; error?: string };
    if (!response.ok) setError(data.error ?? "Checkout could not be loaded");
    else setItems(data.items ?? []);
    setLoading(false);
  }, [router]);
  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  const tax = subtotal * 0.08875;
  const total = subtotal + tax;

  async function pay() {
    setPaying(true); setError("");
    trackEvent("checkout.started", { itemCount: items.length, total: Math.round(total * 100) });
    const response = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await response.json() as { url?: string; error?: string };
    if (response.ok && data.url) window.location.assign(data.url);
    else { setError(data.error ?? "Payment could not be started"); setPaying(false); }
  }

  if (loading) return <div className="flex min-h-72 items-center justify-center text-[#e5a12b]"><LoaderCircle className="h-7 w-7 animate-spin" /></div>;
  if (!items.length) return <div className="border-y border-white/10 py-16 text-center"><p className="text-zinc-400">Your bag is empty.</p><Link href="/products" className="mt-5 inline-flex h-11 items-center bg-[#e5a12b] px-5 text-sm font-semibold text-black">Browse products</Link></div>;

  const unavailable = items.some(item => !item.product.inStock || !item.product.published || item.product.stockQuantity < item.quantity);
  return <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
    <div className="space-y-6">
      <section className="border border-white/10 bg-[#0e0e0c] p-6"><div className="flex items-center gap-3"><Truck className="h-5 w-5 text-[#e5a12b]" /><h2 className="text-lg font-semibold text-white">Delivery only</h2></div><p className="mt-4 text-sm leading-7 text-zinc-400">High Society does not offer pickup. Your metro delivery details and available window are confirmed after payment. The purchaser must be 21+, present, and ready with a valid government-issued ID.</p></section>
      <section className="border border-white/10 bg-[#0e0e0c] p-6"><div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-[#e5a12b]" /><h2 className="text-lg font-semibold text-white">Private payment</h2></div><p className="mt-4 text-sm leading-7 text-zinc-400">Payment is completed on Stripe&apos;s encrypted checkout. High Society never stores your full card number.</p></section>
    </div>
    <aside className="h-fit border border-[#8a5710]/30 bg-[#0e0e0c] p-6"><p className="eyebrow">Order summary</p><div className="mt-6 space-y-3 border-b border-white/10 pb-5">{items.map(item => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="text-zinc-400">{item.quantity} × {item.product.name}</span><span className="shrink-0 text-white">{formatPrice(item.product.price * item.quantity)}</span></div>)}</div><div className="space-y-3 py-5 text-sm"><div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-zinc-400"><span>Estimated tax</span><span>{formatPrice(tax)}</span></div><div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white"><span>Total</span><span>{formatPrice(total)}</span></div></div>{error && <p className="mb-4 border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}<Button onClick={pay} disabled={paying || unavailable} size="lg" className="w-full gap-2 rounded-none"><CreditCard className="h-4 w-4" />{paying ? "Opening secure payment..." : unavailable ? "Review unavailable items" : "Proceed to payment"}</Button><Link href="/cart" className="mt-4 block text-center text-xs text-zinc-500 hover:text-[#e5a12b]">Return to bag</Link></aside>
  </div>;
}
