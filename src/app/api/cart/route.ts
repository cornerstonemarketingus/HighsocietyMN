import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MAX_ITEM_QUANTITY } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity = 1 } = await req.json() as { productId?: string; quantity?: number };
  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
    return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  }

  const product = await db.product.findUnique({ where: { id: productId }, select: { inStock: true, published: true, stockQuantity: true } });
  if (!product?.published || !product.inStock || product.stockQuantity < quantity) {
    return NextResponse.json({ error: "This product is currently unavailable" }, { status: 409 });
  }

  const existing = await db.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    const nextQuantity = existing.quantity + quantity;
    if (nextQuantity > MAX_ITEM_QUANTITY || nextQuantity > product.stockQuantity) {
      return NextResponse.json({ error: "Requested quantity is not available" }, { status: 409 });
    }
    const updated = await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQuantity },
    });
    return NextResponse.json({ item: updated });
  }

  const item = await db.cartItem.create({
    data: { userId: session.user.id, productId, quantity },
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId, quantity } = await req.json() as { itemId?: string; quantity?: number };
  if (!itemId || typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
    return NextResponse.json({ error: "Quantity must be between 1 and 10" }, { status: 400 });
  }

  const cartItem = await db.cartItem.findFirst({
    where: { id: itemId, userId: session.user.id },
    include: { product: { select: { published: true, inStock: true, stockQuantity: true } } },
  });
  if (!cartItem) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  if (!cartItem.product.published || !cartItem.product.inStock || cartItem.product.stockQuantity < quantity) {
    return NextResponse.json({ error: "Requested quantity is not available" }, { status: 409 });
  }
  const result = await db.cartItem.updateMany({
    where: { id: itemId, userId: session.user.id },
    data: { quantity },
  });
  if (!result.count) return NextResponse.json({ error: "Cart item could not be updated" }, { status: 409 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = await req.json();

  await db.cartItem.deleteMany({
    where: { id: itemId, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
