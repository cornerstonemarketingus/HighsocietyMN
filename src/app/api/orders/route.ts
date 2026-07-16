import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ORDER_TAX_RATE = 0.08875;

const OrderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(100),
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1),
  subtotal: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  total: z.number().nonnegative().optional(),
});

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function almostEqualMoney(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.01;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const { items, subtotal, tax, total } = parsed.data;

    const quantityByProductId = new Map<string, number>();
    for (const item of items) {
      quantityByProductId.set(
        item.productId,
        (quantityByProductId.get(item.productId) ?? 0) + item.quantity
      );
    }

    const productIds = [...quantityByProductId.keys()];
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        published: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more items are unavailable" }, { status: 400 });
    }

    const computedSubtotal = roundMoney(
      products.reduce(
        (sum, product) => sum + product.price * (quantityByProductId.get(product.id) ?? 0),
        0
      )
    );
    const computedTax = roundMoney(computedSubtotal * ORDER_TAX_RATE);
    const computedTotal = roundMoney(computedSubtotal + computedTax);

    if (
      (typeof subtotal === "number" && !almostEqualMoney(subtotal, computedSubtotal)) ||
      (typeof tax === "number" && !almostEqualMoney(tax, computedTax)) ||
      (typeof total === "number" && !almostEqualMoney(total, computedTotal))
    ) {
      return NextResponse.json(
        {
          error: "Order totals do not match server pricing",
          pricing: {
            subtotal: computedSubtotal,
            tax: computedTax,
            total: computedTotal,
          },
        },
        { status: 400 }
      );
    }

    const productById = new Map(products.map((product) => [product.id, product]));

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        subtotal: computedSubtotal,
        tax: computedTax,
        total: computedTotal,
        items: {
          create: [...quantityByProductId.entries()].map(([productId, quantity]) => {
            const product = productById.get(productId);
            if (!product) {
              throw new Error(`Missing product for ${productId}`);
            }

            return {
              productId,
              quantity,
              price: product.price,
              name: product.name,
            };
          }),
        },
      },
      include: { items: true },
    });

    // Clear cart
    await db.cartItem.deleteMany({ where: { userId: session.user.id } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
