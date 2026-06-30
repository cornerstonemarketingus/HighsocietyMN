import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/products
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category  = searchParams.get('category');
  const search    = searchParams.get('search');
  const minPrice  = searchParams.get('minPrice');
  const maxPrice  = searchParams.get('maxPrice');
  const strain    = searchParams.get('strain');
  const featured  = searchParams.get('featured');
  const inStock   = searchParams.get('inStock');
  const page      = parseInt(searchParams.get('page') ?? '1', 10);
  const limit     = Math.min(parseInt(searchParams.get('limit') ?? '24', 10), 100);
  const skip      = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (category)             where.category     = category as Prisma.ProductWhereInput['category'];
  if (strain)               where.strain       = strain   as Prisma.ProductWhereInput['strain'];
  if (featured === 'true')  where.featured     = true;
  if (inStock  === 'true')  where.inStock      = true;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { featured: 'desc' } }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit, pages: Math.ceil(total / limit) });
}
