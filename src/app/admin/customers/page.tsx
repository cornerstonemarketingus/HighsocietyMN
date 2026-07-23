import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

async function getCustomers() {
  try {
    return await db.user.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-gray-400 mt-1">{customers.length} registered users</p>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left p-4 text-gray-400 font-medium">Name</th>
              <th className="text-left p-4 text-gray-400 font-medium">Email</th>
              <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Orders</th>
              <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left p-4 text-gray-400 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white">
                    {customer.name ?? "—"}
                  </td>
                  <td className="p-4 text-gray-300">{customer.email}</td>
                  <td className="p-4 hidden md:table-cell text-gray-400">
                    {customer._count.orders}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-400">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={customer.role === "ADMIN" ? "warning" : "outline"}
                    >
                      {customer.role}
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
