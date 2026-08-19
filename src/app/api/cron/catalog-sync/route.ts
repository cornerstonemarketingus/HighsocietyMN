import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [published, inStock, unitsAvailable, lastUpdated] = await Promise.all([
    db.product.count({ where: { published: true } }),
    db.product.count({ where: { published: true, inStock: true, stockQuantity: { gt: 0 } } }),
    db.product.aggregate({ where: { published: true, inStock: true }, _sum: { stockQuantity: true } }),
    db.product.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
  ]);
  const status = { ok: true, mode: "read-only", source: "database", published, inStock, unitsAvailable: unitsAvailable._sum.stockQuantity ?? 0, lastInventoryUpdate: lastUpdated?.updatedAt ?? null };
  console.info(JSON.stringify({ event: "catalog.status.checked", ...status, at: new Date().toISOString() }));
  return NextResponse.json(status);
}
