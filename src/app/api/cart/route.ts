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

  const body = await req.json() as {
    productId?: string;
    quantity?: number;
    variantId?: string;
    customization?: Record<string, string>;
  };
  const productId = body.productId;
  const quantity = Math.max(1, Math.min(Number(body.quantity) || 1, 20));
  if (!productId) {
    return NextResponse.json({ error: "Choose a product." }, { status: 400 });
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || !product.published || !product.inStock) {
    return NextResponse.json({ error: "This product is not available." }, { status: 404 });
  }

  type Variant = { id: string; label: string; price: number; inStock: boolean };
  type RequiredField = { title: string; required: boolean };
  const variants = Array.isArray(product.variants)
    ? (product.variants as unknown as Variant[])
    : [];
  const requiredFields = Array.isArray(product.requiredFields)
    ? (product.requiredFields as unknown as RequiredField[])
    : [];
  const selectedVariant = variants.find((variant) => variant.id === body.variantId);
  if (variants.length && !selectedVariant) {
    return NextResponse.json({ error: "Choose a product option." }, { status: 400 });
  }
  if (selectedVariant && !selectedVariant.inStock) {
    return NextResponse.json({ error: "That option is out of stock." }, { status: 400 });
  }
  const customization = body.customization ?? {};
  const missing = requiredFields.find(
    (field) => field.required && !String(customization[field.title] ?? "").trim(),
  );
  if (missing) {
    return NextResponse.json(
      { error: `Complete “${missing.title}” before adding this product.` },
      { status: 400 },
    );
  }
  const variantId = selectedVariant?.id ?? "";
  const unitPrice = selectedVariant?.price ?? product.price;

  const existing = await db.cartItem.findUnique({
    where: { userId_productId_variantId: { userId: session.user.id, productId, variantId } },
  });

  if (existing) {
    const updated = await db.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
        customization,
        variantLabel: selectedVariant?.label ?? null,
        unitPrice,
      },
    });
    return NextResponse.json({ item: updated });
  }

  const item = await db.cartItem.create({
    data: {
      userId: session.user.id,
      productId,
      quantity,
      variantId,
      variantLabel: selectedVariant?.label ?? null,
      unitPrice,
      customization,
    },
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
