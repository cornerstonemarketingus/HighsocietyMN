'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { getSessionId } from '@/lib/cart-client';
import { TAX_RATE } from '@/lib/constants';
import { firstImage, formatUsd } from '@/lib/format';

type CartItem = {
  productId: string;
  quantity: number;
  product: { name: string; priceCents: number; images: string[] };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = () => {
    const sessionId = getSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setItems(data.items);
        setError('');
      })
      .catch(() => setError('Unable to load cart.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    const sessionId = getSessionId();
    setLoading(true);
    await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, productId, quantity }),
    });
    loadCart();
  };

  const removeItem = async (productId: string) => {
    const sessionId = getSessionId();
    setLoading(true);
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, productId }),
    });
    loadCart();
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.product.priceCents, 0), [items]);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  if (loading) return <p className="text-sm text-slate-600">Loading cart...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-emerald-900/10 bg-white p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-emerald-900">Your cart is empty</h1>
        <p className="mb-6 text-slate-600">Add products to get started.</p>
        <Link href="/products" className="rounded-md bg-emerald-700 px-4 py-2 text-white">
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-3 rounded-xl border border-emerald-900/10 bg-white p-4">
        <h1 className="text-2xl font-bold text-emerald-900">Shopping Cart</h1>
        {items.map((item) => (
          <article key={item.productId} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <div className="relative h-20 w-20 flex-none overflow-hidden rounded-md bg-slate-100">
              <Image src={firstImage(item.product.images)} alt={item.product.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{item.product.name}</p>
              <p className="text-sm text-slate-600">{formatUsd(item.product.priceCents)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  className="h-7 w-7 rounded border border-slate-300"
                >
                  -
                </button>
                <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="h-7 w-7 rounded border border-slate-300"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="ml-3 text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-xl border border-emerald-900/10 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-emerald-900">Order Summary</h2>
        <div className="space-y-1 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><span>{formatUsd(subtotal)}</span></p>
          <p className="flex justify-between"><span>Tax (6.875%)</span><span>{formatUsd(tax)}</span></p>
          <p className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatUsd(total)}</span>
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <Link href="/checkout" className="block rounded-md bg-emerald-700 px-4 py-2 text-center text-white">
            Proceed to Checkout
          </Link>
          <Link href="/products" className="block text-center text-sm text-emerald-700">
            Continue Shopping
          </Link>
        </div>
      </aside>
    </section>
  );
}
