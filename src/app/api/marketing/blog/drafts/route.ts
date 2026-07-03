import { NextResponse } from "next/server";
import { listDrafts } from "@/lib/store";

export function GET() {
  return NextResponse.json({ items: listDrafts() });
}
