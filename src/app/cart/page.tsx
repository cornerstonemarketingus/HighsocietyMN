"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MINNESOTA_CANNABIS_TAX_RATE } from "@/lib/constants";

type CartItem = { productId: string; quantity: number; name: string; price: number };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const load = async () => {
    const response = await fetch("/api/cart");
    const data = await response.json();
    setItems(data.items);
  };

  useEffect(() => {
    const addProduct = async () => {
      const params = new URLSearchParams(window.location.search);
      const addId = params.get("add");
      if (addId) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: addId, quantity: 1 }),
        });
        window.history.replaceState({}, "", "/cart");
      }
      await load();
    };
    addProduct();
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const tax = Number((subtotal * MINNESOTA_CANNABIS_TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const updateQuantity = async (productId: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    await load();
  };

  const remove = async (productId: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Shopping Cart</h1>
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <section className="card space-y-3">
          {items.length === 0 ? <p className="text-emerald-700">Cart is empty.</p> : null}
          {items.map((item) => (
            <article key={item.productId} className="rounded-xl border border-emerald-100 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-emerald-700">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded border px-2" onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>-</button>
                  <span>{item.quantity}</span>
                  <button className="rounded border px-2" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  <button className="text-sm text-red-600" onClick={() => remove(item.productId)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </section>
        <aside className="card space-y-2">
          <p className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p>
          <p className="flex justify-between text-sm"><span>MN Cannabis Tax (6.875%)</span><span>${tax.toFixed(2)}</span></p>
          <p className="flex justify-between text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></p>
          <Link href="/checkout" className="btn block text-center">Proceed to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
