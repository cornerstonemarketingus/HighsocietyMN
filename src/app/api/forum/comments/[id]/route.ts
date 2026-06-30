import { NextResponse } from "next/server";
import { deleteForumComment, updateForumComment } from "@/lib/store";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const comment = updateForumComment(id, String(body.content ?? ""));
  if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  return NextResponse.json(comment);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = deleteForumComment(id);
  if (!deleted) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
