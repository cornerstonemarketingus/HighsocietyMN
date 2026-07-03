import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/forum/threads — list threads (all or by category)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) {
      const cat = await db.forumCategory.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    const [threads, total] = await Promise.all([
      db.forumThread.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { posts: true } },
        },
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
        skip,
        take: limit,
      }),
      db.forumThread.count({ where }),
    ]);

    return NextResponse.json({ threads, total, page, limit });
  } catch (err) {
    console.error("Forum threads GET error:", err);
    return NextResponse.json({ error: "Failed to load threads" }, { status: 500 });
  }
}

// POST /api/forum/threads — create a new thread
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to post" }, { status: 401 });
    }

    const { title, content, categorySlug } = await req.json() as {
      title: string;
      content: string;
      categorySlug: string;
    };

    if (!title?.trim() || !content?.trim() || !categorySlug) {
      return NextResponse.json({ error: "title, content, and categorySlug required" }, { status: 400 });
    }

    const category = await db.forumCategory.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Generate unique slug
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const suffix = Date.now().toString(36);
    const slug = `${base}-${suffix}`;

    const thread = await db.forumThread.create({
      data: {
        title: title.trim(),
        slug,
        categoryId: category.id,
        authorId: session.user.id,
        posts: {
          create: {
            content: content.trim(),
            authorId: session.user.id,
          },
        },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { posts: true } },
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (err) {
    console.error("Forum threads POST error:", err);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
