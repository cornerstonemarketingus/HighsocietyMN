import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MN_CANNABIS_TAX = parseFloat(process.env.MN_CANNABIS_TAX_RATE ?? '0.1');
const MN_SALES_TAX    = parseFloat(process.env.MN_SALES_TAX_RATE    ?? '0.06875');

// GET /api/orders — get current user's orders
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}

// POST /api/orders — create order from cart
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { notes?: string; pickupTime?: string };

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total    = parseFloat((subtotal * (1 + MN_CANNABIS_TAX + MN_SALES_TAX)).toFixed(2));
  const tax      = parseFloat((total - subtotal).toFixed(2));

  const order = await prisma.order.create({
    data: {
      userId:    session.user.id,
      subtotal,
      tax,
      total,
      notes:      body.notes ?? null,
      pickupTime: body.pickupTime ? new Date(body.pickupTime) : null,
      orderItems: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity:  item.quantity,
          unitPrice: item.product.price,
          total:     parseFloat((item.product.price * item.quantity).toFixed(2)),
        })),
      },
    },
    include: { orderItems: { include: { product: true } } },
  });

  // Clear cart after order creation
  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  return NextResponse.json(order, { status: 201 });
}
