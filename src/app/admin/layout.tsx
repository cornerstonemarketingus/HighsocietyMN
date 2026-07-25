import Link from "next/link";
import { Crown, LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-slate-950 font-bold text-sm">High Society MN</p>
              <p className="text-slate-500 text-xs">Admin Dashboard</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-400 hover:bg-slate-50 transition-colors text-sm"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Link href="/" className="text-xs text-slate-500 hover:text-indigo-400">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950"><Crown className="h-5 w-5 text-indigo-600" /> High Society Admin</Link>
          <Link href="/" className="text-xs text-indigo-700">View store</Link>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto">
          {adminLinks.map(({ href, label }) => <Link key={href} href={href} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{label}</Link>)}
        </nav>
      </div>
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
