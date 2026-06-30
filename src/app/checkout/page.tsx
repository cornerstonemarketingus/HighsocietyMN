'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router  = useRouter();
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/orders', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ notes }),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? 'Order failed. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/account');
    router.refresh();
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6 text-sm text-brand-800">
        <strong>Store Pickup Only</strong> — Orders are available for pickup at our Minneapolis location.
        We&apos;ll send you a confirmation when your order is ready.
      </div>

      <form onSubmit={handleOrder} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
            placeholder="Any notes for your order…"
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">Payment</p>
          <p>Payment is collected in-store at pickup. We accept cash and cards.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? 'Placing Order…' : 'Place Order'}
        </button>
      </form>

      <div className="flex justify-center mt-4">
        <Link href="/cart" className="text-sm text-gray-500 hover:text-brand-600">
          ← Back to Cart
        </Link>
      </div>
    </div>
  );
}
