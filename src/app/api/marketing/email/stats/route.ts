import { NextResponse } from "next/server";
import { getEmailStats } from "@/lib/store";

export function GET() {
  return NextResponse.json(getEmailStats());
}
