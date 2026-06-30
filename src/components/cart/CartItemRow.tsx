'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CartItem, Product } from '@prisma/client';

interface CartItemRowProps {
  item: CartItem & { product: Product };
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [qty,     setQty]     = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const update = async (newQty: number) => {
    setLoading(true);
    try {
      if (newQty === 0) {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.productId }),
        });
        window.location.reload();
        return;
      }
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.productId, quantity: newQty }),
      });
      setQty(newQty);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        {item.product.images[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</p>
        <p className="text-xs text-gray-500 capitalize mb-2">
          {item.product.category.replace(/_/g, ' ').toLowerCase()}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update(qty - 1)}
            disabled={loading}
            className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-bold"
          >
            −
          </button>
          <span className="text-sm font-medium min-w-[1.5rem] text-center">{qty}</span>
          <button
            onClick={() => update(qty + 1)}
            disabled={loading}
            className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-brand-700">${(item.product.price * qty).toFixed(2)}</p>
        <p className="text-xs text-gray-400">${item.product.price.toFixed(2)} each</p>
        <button
          onClick={() => update(0)}
          disabled={loading}
          className="text-xs text-red-400 hover:text-red-600 mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
