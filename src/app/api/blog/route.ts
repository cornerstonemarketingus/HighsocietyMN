import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where: { published: true },
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      db.blogPost.count({ where: { published: true } }),
    ]);

    return NextResponse.json({ posts, total, page, limit });
  } catch (err) {
    console.error("Blog API error:", err);
    return NextResponse.json({ error: "Failed to load blog posts" }, { status: 500 });
  }
}
