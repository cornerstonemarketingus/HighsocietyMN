import { NextResponse } from "next/server";
import { deleteForumPost, getForumPosts, updateForumPost } from "@/lib/store";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const post = getForumPosts().find((entry) => entry.id === id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const post = updateForumPost(id, body);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = deleteForumPost(id);
  if (!deleted) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
