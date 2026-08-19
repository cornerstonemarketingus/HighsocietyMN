"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: string;
  quantity: number;
  product: { id: string; name: string; slug: string; price: number; images: string[]; inStock: boolean; category: { name: string } };
};

export function CartClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/cart", { cache: "no-store" });
    if (response.status === 401) { router.replace("/login?callbackUrl=/cart"); return; }
    const data = await response.json() as { items?: CartItem[]; error?: string };
    if (!response.ok) setError(data.error ?? "Cart could not be loaded");
    else setItems(data.items ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("checkout") === "cancelled") {
        setError("Payment was cancelled. Your reserved items are back in your bag.");
      }
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  async function update(item: CartItem, quantity: number) {
    setBusy(item.id); setError("");
    const response = await fetch("/api/cart", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId: item.id, quantity }) });
    if (response.ok) setItems(current => current.map(value => value.id === item.id ? { ...value, quantity } : value));
    else setError("Quantity could not be updated");
    setBusy(null);
  }

  async function remove(itemId: string) {
    setBusy(itemId); setError("");
    const response = await fetch("/api/cart", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId }) });
    if (response.ok) setItems(current => current.filter(item => item.id !== itemId));
    else setError("Item could not be removed");
    setBusy(null);
  }

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  if (loading) return <div className="flex min-h-72 items-center justify-center text-[#e5a12b]"><LoaderCircle className="h-7 w-7 animate-spin" /></div>;
  if (!items.length) return <div className="py-20 text-center"><ShoppingBag className="mx-auto h-14 w-14 text-zinc-700" /><h2 className="mt-6 text-xl text-white">Your bag is empty</h2><p className="mt-2 text-sm text-zinc-500">The collection is waiting.</p><Link href="/products" className="mt-7 inline-flex h-11 items-center bg-[#e5a12b] px-5 text-sm font-semibold text-black">Browse products</Link></div>;

  return <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map(item => <article key={item.id} className="grid grid-cols-[92px_1fr] gap-5 py-6 sm:grid-cols-[116px_1fr_auto]">
        <Link href={`/products/${item.product.slug}`} className="relative aspect-square overflow-hidden bg-[#11110f]">
          {item.product.images[0] && <Image src={item.product.images[0]} alt={item.product.name} fill sizes="116px" className="object-cover" />}
        </Link>
        <div><p className="text-xs uppercase text-[#e5a12b]">{item.product.category.name}</p><Link href={`/products/${item.product.slug}`} className="mt-2 block font-semibold text-white hover:text-[#ffc263]">{item.product.name}</Link><p className="mt-2 text-sm text-zinc-400">{formatPrice(item.product.price)}</p>
          {!item.product.inStock && <p className="mt-2 text-xs text-red-300">Currently unavailable</p>}
        </div>
        <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
          <div className="flex h-9 items-center border border-white/15"><button onClick={() => update(item, item.quantity - 1)} disabled={item.quantity <= 1 || busy === item.id} className="h-full w-9 text-zinc-400 hover:text-white" aria-label="Decrease quantity"><Minus className="mx-auto h-3.5 w-3.5" /></button><span className="w-9 text-center text-sm text-white">{item.quantity}</span><button onClick={() => update(item, item.quantity + 1)} disabled={item.quantity >= 10 || busy === item.id} className="h-full w-9 text-zinc-400 hover:text-white" aria-label="Increase quantity"><Plus className="mx-auto h-3.5 w-3.5" /></button></div>
          <button onClick={() => remove(item.id)} disabled={busy === item.id} className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-red-300"><Trash2 className="h-4 w-4" /> Remove</button>
        </div>
      </article>)}
    </div>
    <aside className="h-fit border border-[#8a5710]/30 bg-[#0e0e0c] p-6 lg:sticky lg:top-24"><p className="eyebrow">Order summary</p><div className="mt-6 flex justify-between border-b border-white/10 pb-5 text-sm"><span className="text-zinc-400">Subtotal</span><strong className="text-white">{formatPrice(subtotal)}</strong></div><p className="mt-4 text-xs leading-5 text-zinc-500">Taxes and fulfillment details are calculated securely at checkout.</p>{error && <p className="mt-4 text-sm text-red-300">{error}</p>}<Link href="/checkout" className="mt-6 flex h-12 items-center justify-center bg-[#e5a12b] text-sm font-semibold text-black hover:bg-[#ffc263]">Continue to checkout</Link></aside>
  </div>;
}
