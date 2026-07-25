import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({})) as {
      fulfillmentMethod?: "PICKUP" | "DELIVERY";
      scheduledAt?: string;
      deliveryAddress?: string;
    };
    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { activeDiscountPercent: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const discountPercent = Math.max(0, Math.min(user?.activeDiscountPercent ?? 0, 100));
    const discountedSubtotal = subtotal * (1 - discountPercent / 100);
    const tax = discountedSubtotal * 0.08875;
    const total = discountedSubtotal + tax;

    // Create pending order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        subtotal: discountedSubtotal,
        tax,
        total,
        fulfillmentMethod: body.fulfillmentMethod ?? "DELIVERY",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        deliveryAddress: body.fulfillmentMethod === "PICKUP" ? null : body.deliveryAddress || null,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          })),
        },
      },
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: item.product.images.slice(0, 1),
          },
          unit_amount: Math.round(item.product.price * (1 - discountPercent / 100) * 100),
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: order.id, discountPercent: String(discountPercent) },
      success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
