import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/cart — return current user's cart
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(items);
}

// POST /api/cart — add item or update quantity
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity = 1 } = await req.json() as { productId: string; quantity?: number };
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
    return NextResponse.json({ error: 'quantity must be between 1 and 99' }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { quantity: qty },
    create: { userId: session.user.id, productId, quantity: qty },
    include: { product: true },
  });

  return NextResponse.json(item);
}

// DELETE /api/cart — remove item
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await req.json() as { productId: string };
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  return NextResponse.json({ success: true });
}
