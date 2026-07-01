'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
}

export function AddToCartButton({ productId, productName }: AddToCartButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'added' | 'error'>('idle');
  const [qty, setQty] = useState(1);

  const handleAdd = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('added');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={status === 'loading'}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
          status === 'added'
            ? 'bg-green-500 text-white'
            : status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-brand-600 hover:bg-brand-700 text-white'
        }`}
      >
        {status === 'added' ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart!
          </>
        ) : status === 'loading' ? (
          <span className="animate-pulse">Adding…</span>
        ) : status === 'error' ? (
          'Sign in to add to cart'
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart — {productName}
          </>
        )}
      </button>
    </div>
  );
}
