import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 8,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        name: true,
        priceCents: true,
        images: true,
      },
    });

    return NextResponse.json({ product: { ...product, related } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}
