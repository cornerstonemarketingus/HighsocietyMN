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
        <h1 className="text-2xl font-bold text-slate-950">Customers</h1>
        <p className="text-slate-600 mt-1">{customers.length} registered users</p>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-4 text-slate-600 font-medium">Name</th>
              <th className="text-left p-4 text-slate-600 font-medium">Email</th>
              <th className="text-left p-4 text-slate-600 font-medium hidden md:table-cell">Orders</th>
              <th className="text-left p-4 text-slate-600 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left p-4 text-slate-600 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-950">
                    {customer.name ?? "—"}
                  </td>
                  <td className="p-4 text-slate-700">{customer.email}</td>
                  <td className="p-4 hidden md:table-cell text-slate-600">
                    {customer._count.orders}
                  </td>
                  <td className="p-4 hidden md:table-cell text-slate-600">
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
