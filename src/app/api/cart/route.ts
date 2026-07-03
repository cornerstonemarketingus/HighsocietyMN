import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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

  const { productId, quantity = 1 } = await req.json();

  const existing = await db.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    const updated = await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
    return NextResponse.json({ item: updated });
  }

  const item = await db.cartItem.create({
    data: { userId: session.user.id, productId, quantity },
  });

  return NextResponse.json({ item }, { status: 201 });
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
