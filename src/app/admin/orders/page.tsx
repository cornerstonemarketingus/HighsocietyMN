import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  READY: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
  REFUNDED: "outline",
};

async function getOrders() {
  try {
    return await db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">{orders.length} total orders</p>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left p-4 text-gray-400 font-medium">Order</th>
              <th className="text-left p-4 text-gray-400 font-medium hidden sm:table-cell">Customer</th>
              <th className="text-left p-4 text-gray-400 font-medium">Total</th>
              <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Date</th>
              <th className="text-left p-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="text-white font-medium font-mono text-xs">
                      {order.orderNumber}
                    </p>
                    <p className="text-gray-500 text-xs">{order.items.length} item(s)</p>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <p className="text-gray-300">{order.user?.name ?? "—"}</p>
                    <p className="text-gray-500 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="p-4 text-amber-400 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <Badge variant={statusVariant[order.status] ?? "outline"}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
