import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = (params.get("search") ?? "").toLowerCase();
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const page = Number(params.get("page") ?? "1");
  const limit = Number(params.get("limit") ?? "20");
  const potency = Number(params.get("potency") ?? "0");
  const effects = params.get("effects") ?? "";

  let products = getProducts().filter((product) => (!search || product.name.toLowerCase().includes(search)) && (!category || product.category === category) && (!potency || product.thc >= potency) && (!effects || product.effects.includes(effects)));

  if (sort === "price_desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "price_asc") products = [...products].sort((a, b) => a.price - b.price);

  const start = (page - 1) * limit;
  return NextResponse.json({
    total: products.length,
    page,
    limit,
    items: products.slice(start, start + limit),
  });
}
