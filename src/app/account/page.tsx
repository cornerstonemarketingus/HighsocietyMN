export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, createdAt: true, role: true },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { orderItems: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  if (!user) redirect('/login');

  const STATUS_COLORS: Record<string, string> = {
    PENDING:          'bg-yellow-100 text-yellow-800',
    CONFIRMED:        'bg-blue-100   text-blue-800',
    READY_FOR_PICKUP: 'bg-brand-100  text-brand-800',
    COMPLETED:        'bg-green-100  text-green-800',
    CANCELLED:        'bg-red-100    text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-2xl mb-4">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
            <h2 className="font-semibold text-lg text-gray-900">{user.name ?? 'Customer'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.role !== 'CUSTOMER' && (
              <span className="inline-block mt-2 text-xs bg-brand-100 text-brand-700 font-medium px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            )}
            <div className="mt-4 space-y-2">
              <Link href="/cart" className="block text-sm text-brand-600 hover:text-brand-700">→ View Cart</Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="block text-sm text-brand-600 hover:text-brand-700">→ Admin Dashboard</Link>
              )}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
          {orders.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              <p className="mb-3">No orders yet.</p>
              <Link href="/shop" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <p className="text-sm font-bold text-brand-700 mt-1">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    {order.orderItems.map((oi) => (
                      <p key={oi.id}>
                        {oi.quantity}× {oi.product.name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
