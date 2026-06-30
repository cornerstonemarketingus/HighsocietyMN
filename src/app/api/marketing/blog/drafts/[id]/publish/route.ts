import { NextResponse } from "next/server";
import { publishDraft } from "@/lib/store";

export async function PATCH(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const draft = publishDraft(id);
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  return NextResponse.json(draft);
}
