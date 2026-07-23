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
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">{products.length} total products</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left p-4 text-gray-400 font-medium">Product</th>
              <th className="text-left p-4 text-gray-400 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left p-4 text-gray-400 font-medium">Price</th>
              <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Stock</th>
              <th className="text-left p-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No products yet. Add your first product.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.sku ?? product.id.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-gray-300">{product.category.name}</span>
                  </td>
                  <td className="p-4 text-amber-400 font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-300">
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
