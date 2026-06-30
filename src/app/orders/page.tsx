import Link from "next/link";
import { listOrders } from "@/lib/store";

export default async function OrdersPage() {
  const orders = listOrders("demo-user");

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Order History</h1>
      <section className="space-y-3">
        {orders.length === 0 ? <p className="card text-emerald-700">No orders yet. Checkout to create one.</p> : null}
        {orders.map((order: { id: string; status: string; total: number; fulfillmentType: string; scheduledFor: string }) => (
          <article key={order.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Order #{order.id}</p>
                <p className="text-lg font-bold text-emerald-950">{order.status}</p>
                <p className="text-sm text-emerald-800">{order.fulfillmentType} • {order.scheduledFor}</p>
              </div>
              <p className="text-xl font-black text-emerald-900">${order.total.toFixed(2)}</p>
            </div>
            <Link href={`/api/orders/${order.id}`} className="mt-3 inline-flex rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold">View JSON detail</Link>
          </article>
        ))}
      </section>
    </div>
  );
}
