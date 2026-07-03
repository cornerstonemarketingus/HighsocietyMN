'use client';

import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { calculateTax, formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCartStore((state) => ({
    items: state.items,
    isOpen: state.isOpen,
    closeCart: state.closeCart,
    updateQuantity: state.updateQuantity,
    removeItem: state.removeItem,
    subtotal: state.subtotal,
  }));

  const subtotalAmount = subtotal();
  const tax = calculateTax(subtotalAmount);
  const total = subtotalAmount + tax;

  return (
    <div className={`fixed inset-0 z-50 transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/70 transition ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeCart} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#050505] p-6 transition duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Your cart</p>
            <h2 className="text-2xl font-bold">Ready when you are</h2>
          </div>
          <button className="rounded-full p-2 hover:bg-white/10" onClick={closeCart}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 p-8 text-center text-slate-400">
              Your cart is empty. Start with a featured strain or a live resin cart.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.product.weight ?? item.product.category}</p>
                    <p className="mt-2 text-brand-300">{formatPrice(item.product.price)}</p>
                  </div>
                  <button className="text-sm text-slate-500 hover:text-white" onClick={() => removeItem(item.product.id)}>
                    Remove
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotalAmount)}</span></div>
            <div className="flex justify-between"><span>Minnesota tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-base font-semibold text-white"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <div className="mt-5 grid gap-3">
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full">Checkout</Button>
            </Link>
            <Link href="/cart" onClick={closeCart}>
              <Button variant="ghost" className="w-full">View full cart</Button>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
