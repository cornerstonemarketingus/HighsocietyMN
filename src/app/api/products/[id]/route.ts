import { NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = getProducts().find((entry) => entry.id === id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
