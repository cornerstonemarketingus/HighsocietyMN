import { NextResponse } from 'next/server';

import { TAX_RATE } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body.sessionId as string | undefined;
    const fulfillmentType = body.fulfillmentType as 'PICKUP' | 'DELIVERY' | undefined;
    const pickupDate = body.pickupDate ? new Date(body.pickupDate as string) : null;
    const pickupLocation = body.pickupLocation as string | undefined;
    const deliveryAddress = body.deliveryAddress as string | undefined;

    if (!sessionId || !fulfillmentType) {
      return NextResponse.json({ error: 'sessionId and fulfillmentType are required.' }, { status: 400 });
    }

    if (fulfillmentType === 'PICKUP' && (!pickupDate || !pickupLocation)) {
      return NextResponse.json({ error: 'Pickup date and location are required.' }, { status: 400 });
    }

    if (fulfillmentType === 'DELIVERY' && (!deliveryAddress || deliveryAddress.trim().length < 8)) {
      return NextResponse.json({ error: 'Valid delivery address is required.' }, { status: 400 });
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const subtotalCents = cart.items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + taxCents;

    const order = await prisma.order.create({
      data: {
        sessionId,
        fulfillmentType,
        subtotalCents,
        taxCents,
        totalCents,
        pickupDate: fulfillmentType === 'PICKUP' ? pickupDate : null,
        pickupLocation: fulfillmentType === 'PICKUP' ? pickupLocation : null,
        deliveryAddress: fulfillmentType === 'DELIVERY' ? deliveryAddress : null,
        items: {
          createMany: {
            data: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceCents: item.product.priceCents,
            })),
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: sessionId } });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
