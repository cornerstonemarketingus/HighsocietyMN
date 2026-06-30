'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getSessionId } from '@/lib/cart-client';
import { TAX_RATE } from '@/lib/constants';
import { formatUsd } from '@/lib/format';

type CartItem = {
  productId: string;
  quantity: number;
  product: { name: string; priceCents: number };
};

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const [fulfillmentType, setFulfillmentType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Downtown Minneapolis');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => setItems(data.items))
      .catch(() => setError('Unable to load order summary.'))
      .finally(() => setLoading(false));
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.product.priceCents, 0), [items]);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const validate = () => {
    if (items.length === 0) return 'Your cart is empty.';
    if (fulfillmentType === 'PICKUP') {
      if (!pickupDate) return 'Pickup date/time is required.';
      if (!pickupLocation) return 'Pickup location is required.';
    }

    if (fulfillmentType === 'DELIVERY') {
      if (deliveryAddress.trim().length < 8) return 'Please provide a valid delivery address.';
    }

    return '';
  };

  const placeOrder = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPlacingOrder(true);
    setError('');

    const sessionId = getSessionId();
    const pickupIsoDate =
      pickupDate && !Number.isNaN(new Date(pickupDate).getTime()) ? new Date(pickupDate).toISOString() : null;
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        fulfillmentType,
        pickupDate: pickupIsoDate,
        pickupLocation,
        deliveryAddress,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error || 'Failed to place order.');
      setPlacingOrder(false);
      return;
    }

    const data = await response.json();
    router.push(`/order-confirmation/${data.order.id}`);
  };

  if (loading) return <p className="text-sm text-slate-600">Loading checkout...</p>;

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4 rounded-xl border border-emerald-900/10 bg-white p-4">
        <h1 className="text-2xl font-bold text-emerald-900">Checkout</h1>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Fulfillment Type</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFulfillmentType('PICKUP')}
              className={`rounded-md px-3 py-2 text-sm ${fulfillmentType === 'PICKUP' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Pickup
            </button>
            <button
              type="button"
              onClick={() => setFulfillmentType('DELIVERY')}
              className={`rounded-md px-3 py-2 text-sm ${fulfillmentType === 'DELIVERY' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Delivery
            </button>
          </div>
        </div>

        {fulfillmentType === 'PICKUP' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="pickupDate">
                Pickup Date & Time
              </label>
              <input
                id="pickupDate"
                type="datetime-local"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="pickupLocation">
                Pickup Location
              </label>
              <select
                id="pickupLocation"
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              >
                <option>Downtown Minneapolis</option>
                <option>North Loop</option>
                <option>St. Paul Midway</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="deliveryAddress">
              Delivery Address
            </label>
            <textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Street address, city, state, ZIP"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={placeOrder}
          disabled={placingOrder}
          className="rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white disabled:bg-slate-400"
        >
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>

      <aside className="h-fit rounded-xl border border-emerald-900/10 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-emerald-900">Order Summary</h2>
        <ul className="mb-3 space-y-1 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-2">
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatUsd(item.product.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between text-sm"><span>Subtotal</span><span>{formatUsd(subtotal)}</span></p>
        <p className="flex justify-between text-sm"><span>Tax</span><span>{formatUsd(tax)}</span></p>
        <p className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
          <span>Total</span><span>{formatUsd(total)}</span>
        </p>
      </aside>
    </section>
  );
}
