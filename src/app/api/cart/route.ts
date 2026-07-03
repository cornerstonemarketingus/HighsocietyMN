import { NextResponse } from "next/server";
import { clearCartItem, getCart, getProducts, setCartItem } from "@/lib/store";
import { getUserId } from "@/lib/session";

const mapCartItems = (items: Array<{ productId: string; quantity: number }>) =>
  items
    .map((item) => {
      const product = getProducts().find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { ...item, name: product.name, price: product.price };
    })
    .filter(Boolean);

export async function GET() {
  const userId = await getUserId();
  const rawItems = getCart(userId);
  return NextResponse.json({ rawItems, items: mapCartItems(rawItems) });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  const body = await request.json();
  const quantity = Number(body.quantity ?? 1);
  const productId = String(body.productId);
  const existing = getCart(userId).find((entry) => entry.productId === productId);
  const next = setCartItem(userId, productId, (existing?.quantity ?? 0) + quantity);
  return NextResponse.json({ items: mapCartItems(next) });
}

export async function PATCH(request: Request) {
  const userId = await getUserId();
  const body = await request.json();
  const next = setCartItem(userId, String(body.productId), Number(body.quantity));
  return NextResponse.json({ items: mapCartItems(next) });
}

export async function DELETE(request: Request) {
  const userId = await getUserId();
  const body = await request.json();
  const next = clearCartItem(userId, String(body.productId));
  return NextResponse.json({ items: mapCartItems(next) });
}
