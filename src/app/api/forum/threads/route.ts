import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { exceedsBodyLimit, rateLimit, readBoundedJson } from "@/lib/request-guards";

export const dynamic = "force-dynamic";
const TITLE_MIN = 5;
const TITLE_MAX = 140;
const CONTENT_MIN = 10;
const CONTENT_MAX = 10_000;

// GET /api/forum/threads — list threads (all or by category)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10) || 20));
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
    return NextResponse.json(
      { error: "Forum service temporarily unavailable", threads: [], total: 0, page: 1, limit: 20, postingAvailable: false },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}

// POST /api/forum/threads — create a new thread
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to post" }, { status: 401 });
    }
    if (exceedsBodyLimit(req, 15_000)) return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    const retryAfter = rateLimit(req, `forum-thread:${session.user.id}`, 5, 10 * 60_000);
    if (retryAfter) return NextResponse.json({ error: "Please wait before creating another topic" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { title, content, categorySlug } = await readBoundedJson<{
      title: string;
      content: string;
      categorySlug: string;
    }>(req, 15_000);

    if (!title?.trim() || !content?.trim() || !categorySlug) {
      return NextResponse.json({ error: "title, content, and categorySlug required" }, { status: 400 });
    }
    if (title.trim().length < TITLE_MIN || title.trim().length > TITLE_MAX) return NextResponse.json({ error: `Title must be ${TITLE_MIN}-${TITLE_MAX} characters` }, { status: 400 });
    if (content.trim().length < CONTENT_MIN || content.trim().length > CONTENT_MAX) return NextResponse.json({ error: `Content must be ${CONTENT_MIN}-${CONTENT_MAX} characters` }, { status: 400 });

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
    if (err instanceof RangeError) return NextResponse.json({ error: err.message }, { status: 413 });
    console.error("Forum threads POST error:", err);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
