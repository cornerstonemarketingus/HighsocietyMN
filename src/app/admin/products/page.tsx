import { db } from "@/lib/db";
import { ProductManager } from "./ProductManager";

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
  const [products, categories] = await Promise.all([
    getProducts(),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return <ProductManager initialProducts={products} categories={categories} />;
}
