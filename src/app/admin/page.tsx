import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [productCount, orderCount, userCount, revenueData] = await Promise.all([
      db.product.count({ where: { published: true } }),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({
        where: { status: { in: ["CONFIRMED", "READY", "COMPLETED"] } },
        _sum: { total: true },
      }),
    ]);
    return {
      productCount,
      orderCount,
      userCount,
      revenue: revenueData._sum.total ?? 0,
    };
  } catch {
    return { productCount: 0, orderCount: 0, userCount: 0, revenue: 0 };
  }
}

async function getRecentOrders() {
  try {
    return await db.order.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()]);

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: DollarSign, color: "text-amber-400" },
    { label: "Total Orders", value: stats.orderCount.toString(), icon: ShoppingBag, color: "text-blue-400" },
    { label: "Products", value: stats.productCount.toString(), icon: Package, color: "text-green-400" },
    { label: "Customers", value: stats.userCount.toString(), icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back to High Society MN</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="border border-white/10 rounded-xl p-5 bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{label}</span>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-white font-semibold">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders yet.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-gray-400 text-xs">{order.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-medium">{formatPrice(order.total)}</p>
                  <span className="text-xs text-gray-500 capitalize">{order.status.toLowerCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
