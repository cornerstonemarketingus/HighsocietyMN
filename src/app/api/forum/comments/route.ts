import { NextResponse } from "next/server";
import { createForumComment } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json();
  const comment = createForumComment(String(body.postId), String(body.content ?? ""));
  return NextResponse.json(comment, { status: 201 });
}
