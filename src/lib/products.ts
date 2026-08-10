import { db } from "@/lib/db";

export async function attachSoldCounts<T extends { id: string }>(
  products: T[],
): Promise<(T & { unitsSold: number })[]> {
  if (products.length === 0) return [];

  const sums = await db.orderItem.groupBy({
    by: ["productId"],
    where: { productId: { in: products.map((p) => p.id) } },
    _sum: { quantity: true },
  });

  const soldByProductId = new Map(sums.map((row) => [row.productId, row._sum.quantity ?? 0]));

  return products.map((product) => ({
    ...product,
    unitsSold: soldByProductId.get(product.id) ?? 0,
  }));
}
