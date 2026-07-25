import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    return await db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Products</h1>
          <p className="text-slate-600 mt-1">{products.length} total products</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-4 text-slate-600 font-medium">Product</th>
              <th className="text-left p-4 text-slate-600 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left p-4 text-slate-600 font-medium">Price</th>
              <th className="text-left p-4 text-slate-600 font-medium hidden md:table-cell">Stock</th>
              <th className="text-left p-4 text-slate-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No products yet. Add your first product.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-slate-950 font-medium">{product.name}</p>
                      <p className="text-slate-500 text-xs">{product.sku ?? product.id.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-slate-700">{product.category.name}</span>
                  </td>
                  <td className="p-4 text-indigo-400 font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4 hidden md:table-cell text-slate-700">
                    {product.stockQuantity}
                  </td>
                  <td className="p-4">
                    <Badge variant={product.published ? (product.inStock ? "success" : "warning") : "danger"}>
                      {!product.published ? "Draft" : product.inStock ? "Active" : "OOS"}
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
