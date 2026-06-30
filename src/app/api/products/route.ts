import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { CATEGORY_OPTIONS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category');
    const minPrice = Number(searchParams.get('minPrice') ?? 0);
    const maxPrice = Number(searchParams.get('maxPrice') ?? 999999);
    const potency = searchParams.get('potency');
    const sort = searchParams.get('sort') ?? 'newest';
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit') ?? 12)));

    const where: Prisma.ProductWhereInput = {
      priceCents: {
        gte: Math.round(minPrice * 100),
        lte: Math.round(maxPrice * 100),
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      if (!CATEGORY_OPTIONS.includes(category as (typeof CATEGORY_OPTIONS)[number])) {
        return NextResponse.json({ error: 'Invalid category value.' }, { status: 400 });
      }

      where.category = category as Prisma.EnumCategoryFilter<'Product'>;
    }

    if (potency === 'light') {
      where.thcPercent = { lt: 10 };
    } else if (potency === 'medium') {
      where.thcPercent = { gte: 10, lt: 20 };
    } else if (potency === 'strong') {
      where.thcPercent = { gte: 20 };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price_asc'
        ? { priceCents: 'asc' }
        : sort === 'price_desc'
          ? { priceCents: 'desc' }
          : { createdAt: 'desc' };

    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}
