export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CartItemRow } from '@/components/cart/CartItemRow';

const MN_CANNABIS_TAX = parseFloat(process.env.MN_CANNABIS_TAX_RATE ?? '0.1');
const MN_SALES_TAX    = parseFloat(process.env.MN_SALES_TAX_RATE    ?? '0.06875');

export default async function CartPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-serif font-bold mb-3">Your Cart</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your cart.</p>
        <Link href="/login" className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-serif font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some products to get started.</p>
        <Link href="/shop" className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax      = subtotal * (MN_CANNABIS_TAX + MN_SALES_TAX);
  const total    = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Cannabis Tax (10%)</span>
                <span>${(subtotal * MN_CANNABIS_TAX).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Sales Tax (6.875%)</span>
                <span>${(subtotal * MN_SALES_TAX).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-brand-700">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full block text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center text-sm text-gray-500 hover:text-brand-600 mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
