'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getSessionId } from '@/lib/cart-client';
import { formatUsd } from '@/lib/format';

type Order = {
  id: string;
  fulfillmentType: 'PICKUP' | 'DELIVERY';
  totalCents: number;
  pickupLocation: string | null;
  deliveryAddress: string | null;
  createdAt: string;
};

export default function ConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = getSessionId();

    fetch(`/api/orders?sessionId=${sessionId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        const found = data.orders.find((entry: Order) => entry.id === id);
        if (!found) {
          setError('Order not found.');
          return;
        }
        setOrder(found);
      })
      .catch(() => setError('Unable to load confirmation details.'));
  }, [id]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!order) return <p className="text-sm text-slate-600">Loading order confirmation...</p>;

  return (
    <section className="rounded-xl border border-emerald-900/10 bg-white p-6">
      <h1 className="text-2xl font-bold text-emerald-900">Order Confirmed</h1>
      <p className="mt-2 text-slate-700">Order number: <span className="font-semibold">{order.id.slice(-8).toUpperCase()}</span></p>
      <p className="text-slate-700">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
      <p className="text-slate-700">Fulfillment: {order.fulfillmentType}</p>
      {order.fulfillmentType === 'PICKUP' ? (
        <p className="text-slate-700">Pickup location: {order.pickupLocation}</p>
      ) : (
        <p className="text-slate-700">Delivery address: {order.deliveryAddress}</p>
      )}
      <p className="mt-2 text-lg font-semibold text-emerald-800">Total: {formatUsd(order.totalCents)}</p>
      <div className="mt-4 flex gap-3">
        <Link href="/products" className="rounded-md bg-emerald-700 px-4 py-2 text-white">
          Continue Shopping
        </Link>
        <Link href="/cart" className="rounded-md border border-emerald-700 px-4 py-2 text-emerald-700">
          View Cart
        </Link>
      </div>
    </section>
  );
}
