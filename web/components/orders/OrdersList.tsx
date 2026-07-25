import type { OrderRecord } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatPrice } from '@/lib/utils';

export function OrdersList({ orders }: { orders: OrderRecord[] }) {
  return (
    <section className="page-shell py-12">
      <div className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Order history</p>
        <h1 className="section-heading">Track recent pickup and delivery orders</h1>
        <p className="max-w-3xl text-lg text-slate-300 light:text-slate-600">
          Follow fulfillment status, revisit past items, and quickly reorder your favorites.
        </p>
      </div>
      <div className="space-y-6">
        {orders.map((order) => (
          <article key={order.id} className="glass-card rounded-[32px] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold">{order.id}</h2>
                  <Badge>{order.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-400 light:text-slate-600">
                  {order.fulfillmentType} • Scheduled {formatDate(order.scheduledTime)} • Ordered {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total</p>
                <p className="text-2xl font-bold text-brand-300">{formatPrice(order.total)}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.productId}`} className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm">
                  <p className="font-semibold">{item.productName}</p>
                  <p className="mt-1 text-slate-400">Qty {item.quantity}</p>
                  <p className="mt-2 text-brand-200">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline">Reorder these items</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
