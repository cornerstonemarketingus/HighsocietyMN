import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { exceedsBodyLimit, rateLimit, readBoundedJson } from "@/lib/request-guards";

export const dynamic = "force-dynamic";

// GET /api/forum/threads/[id]/posts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10) || 20));
    const skip = (page - 1) * limit;

    const thread = await db.forumThread.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Increment view count
    await db.forumThread.update({ where: { id: thread.id }, data: { views: { increment: 1 } } });

    const [posts, total] = await Promise.all([
      db.forumPost.findMany({
        where: { threadId: thread.id },
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      db.forumPost.count({ where: { threadId: thread.id } }),
    ]);

    return NextResponse.json({ thread, posts, total, page, limit });
  } catch (err) {
    console.error("Forum posts GET error:", err);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

// POST /api/forum/threads/[id]/posts — reply to a thread
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to reply" }, { status: 401 });
    }
    if (exceedsBodyLimit(req, 12_000)) return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    const retryAfter = rateLimit(req, `forum-reply:${session.user.id}`, 12, 10 * 60_000);
    if (retryAfter) return NextResponse.json({ error: "Please wait before posting another reply" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

    const { id } = await params;
    const { content } = await readBoundedJson<{ content: string }>(req, 12_000);

    if (!content?.trim()) {
      return NextResponse.json({ error: "content required" }, { status: 400 });
    }
    if (content.trim().length < 2 || content.trim().length > 10_000) return NextResponse.json({ error: "Reply must be 2-10000 characters" }, { status: 400 });

    const thread = await db.forumThread.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    if (thread.locked) {
      return NextResponse.json({ error: "Thread is locked" }, { status: 403 });
    }

    const post = await db.forumPost.create({
      data: { threadId: thread.id, authorId: session.user.id, content: content.trim() },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    // Bump thread updatedAt
    await db.forumThread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof RangeError) return NextResponse.json({ error: err.message }, { status: 413 });
    console.error("Forum posts POST error:", err);
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
