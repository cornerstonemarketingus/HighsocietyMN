import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("search") ?? "").toLowerCase();
  const items = getProducts().filter((product) => !query || product.name.toLowerCase().includes(query)).slice(0, 10);
  return NextResponse.json({ items });
}
