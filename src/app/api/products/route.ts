import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "24");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { published: true };

    if (category) {
      const cat = await db.category.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        orderBy: { featured: "desc" },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
