import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export function POST(request: NextRequest) {
  const effect = request.nextUrl.searchParams.get("effect") ?? "Relaxed";
  const potency = Number(request.nextUrl.searchParams.get("potency") ?? "0");
  const category = request.nextUrl.searchParams.get("category") ?? "";
  const items = getProducts()
    .filter((product) => product.effects.includes(effect) && product.thc >= potency && (!category || product.category === category))
    .slice(0, 5);
  return NextResponse.json({ items });
}
