import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAndPublishBlog } from "@/lib/blog-automation";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.OLLAMA_BASE_URL) return NextResponse.json({ error: "Ollama is not configured" }, { status: 503 });
  const preferredEmail = process.env.AUTO_BLOG_AUTHOR_EMAIL?.trim();
  const author = await db.user.findFirst({
    where: preferredEmail ? { role: "ADMIN", email: preferredEmail } : { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!author) return NextResponse.json({ error: "No admin author is configured" }, { status: 503 });
  try {
    const post = await generateAndPublishBlog({ authorId: author.id });
    console.info(JSON.stringify({ event: "blog.autopublished", postId: post.id, slug: post.slug, at: new Date().toISOString() }));
    return NextResponse.json({ ok: true, post: { id: post.id, slug: post.slug, title: post.title } });
  } catch (error) {
    console.error("Automated blog publishing failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Blog generation failed" }, { status: 502 });
  }
}
