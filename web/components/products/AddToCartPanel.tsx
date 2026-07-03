'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { ProductRecord } from '@/lib/catalog';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

export function AddToCartPanel({ product }: { product: ProductRecord }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="glass-card rounded-[28px] p-6">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 p-2">
        <button className="rounded-full p-2 hover:bg-white/10" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button className="rounded-full p-2 hover:bg-white/10" onClick={() => setQuantity((value) => value + 1)}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button size="lg" className="mt-4 w-full" onClick={() => addItem(product, quantity)}>
        <ShoppingBag className="mr-2 h-4 w-4" />
        Add {quantity} to cart
      </Button>
    </div>
  );
}
