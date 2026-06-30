import { NextResponse } from "next/server";
import { generateDraft } from "@/lib/store";

export function POST() {
  const draft = generateDraft();
  return NextResponse.json(draft, { status: 201 });
}
