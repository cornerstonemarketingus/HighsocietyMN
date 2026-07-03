import { NextResponse } from "next/server";
import { createBlog, listBlogs } from "@/lib/store";

export function GET() {
  return NextResponse.json({ items: listBlogs() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = createBlog(String(body.title ?? "Untitled"), String(body.content ?? ""));
  return NextResponse.json(post, { status: 201 });
}
