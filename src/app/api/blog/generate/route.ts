import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAndPublishBlog } from "@/lib/blog-automation";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({})) as { topic?: unknown };
    const topic = typeof body.topic === "string" ? body.topic : undefined;
    const post = await generateAndPublishBlog({ authorId: session.user.id, topic });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Manual blog generation failed", error);
    const message = error instanceof Error ? error.message : "Blog generation failed";
    return NextResponse.json({ error: message }, { status: message.includes("configured") ? 503 : 502 });
  }
}
