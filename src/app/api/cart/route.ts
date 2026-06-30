import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ items: cart?.items ?? [] });
  } catch {
    return NextResponse.json({ error: 'Failed to load cart.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body.sessionId as string | undefined;
    const productId = body.productId as string | undefined;
    const quantity = Math.max(1, Number(body.quantity ?? 1));

    if (!sessionId || !productId) {
      return NextResponse.json({ error: 'sessionId and productId are required.' }, { status: 400 });
    }

    await prisma.cart.upsert({
      where: { id: sessionId },
      update: {},
      create: { id: sessionId },
    });

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: sessionId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: sessionId,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to add item to cart.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body.sessionId as string | undefined;
    const productId = body.productId as string | undefined;
    const quantity = Number(body.quantity);

    if (!sessionId || !productId || Number.isNaN(quantity)) {
      return NextResponse.json({ error: 'sessionId, productId, and quantity are required.' }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: sessionId, productId },
      });
      return NextResponse.json({ ok: true });
    }

    await prisma.cartItem.updateMany({
      where: { cartId: sessionId, productId },
      data: { quantity },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update cart item.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body.sessionId as string | undefined;
    const productId = body.productId as string | undefined;

    if (!sessionId || !productId) {
      return NextResponse.json({ error: 'sessionId and productId are required.' }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: sessionId,
        productId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove cart item.' }, { status: 500 });
  }
}
