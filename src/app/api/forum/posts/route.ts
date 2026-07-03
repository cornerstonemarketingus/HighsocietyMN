import { NextResponse } from "next/server";
import { createForumPost, getForumPosts } from "@/lib/store";

export function GET() {
  return NextResponse.json({ items: getForumPosts() });
}

export async function POST(request: Request) {
  let body: { title?: string; content?: string; category?: string } = {};
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    body = await request.json();
  } else {
    const form = await request.formData();
    body = {
      title: String(form.get("title") ?? ""),
      content: String(form.get("content") ?? ""),
      category: String(form.get("category") ?? "General"),
    };
  }

  createForumPost(body.title ?? "Untitled", body.content ?? "", body.category ?? "General");
  return NextResponse.redirect(new URL("/community", request.url), 303);
}
