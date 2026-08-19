import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { calculateCheckoutTotals, validateCheckoutProducts } from "@/lib/checkout";
import { generateOrderNumber } from "@/lib/utils";
import { releasePendingOrder } from "@/lib/order-inventory";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments are not configured yet. Please check back shortly." }, { status: 503 });
  }

  let reservedOrderId: string | null = null;
  let createdStripeSessionId: string | null = null;
  try {
    const result = await db.$transaction(async transaction => {
      const cartItems = await transaction.cartItem.findMany({
        where: { userId: session.user.id },
        include: { product: true },
      });
      const checkoutItems = cartItems.map(item => ({
        id: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        published: item.product.published,
        inStock: item.product.inStock,
        stockQuantity: item.product.stockQuantity,
      }));
      const validationError = validateCheckoutProducts(checkoutItems);
      if (validationError) throw new Error(validationError);

      const totals = calculateCheckoutTotals(checkoutItems);
      for (const item of checkoutItems) {
        const reserved = await transaction.product.updateMany({
          where: { id: item.id, published: true, inStock: true, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (reserved.count !== 1) throw new Error(`${item.name} sold out while checkout was starting`);
        await transaction.product.updateMany({ where: { id: item.id, stockQuantity: 0 }, data: { inStock: false } });
      }

      const order = await transaction.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          fulfillmentMethod: "DELIVERY",
          subtotal: totals.subtotalCents / 100,
          tax: totals.taxCents / 100,
          total: totals.totalCents / 100,
          items: { create: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price, name: item.name })) },
        },
        include: { items: true },
      });
      await transaction.cartItem.deleteMany({ where: { userId: session.user.id } });
      return { order, checkoutItems, totals };
    });
    reservedOrderId = result.order.id;

    const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? req.nextUrl.origin;
    const lineItems = result.checkoutItems.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    if (result.totals.taxCents > 0) {
      lineItems.push({
        price_data: { currency: "usd", product_data: { name: "Minnesota sales tax" }, unit_amount: result.totals.taxCents },
        quantity: 1,
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: { orderId: result.order.id, expectedTotalCents: String(result.totals.totalCents), fulfillmentMethod: "DELIVERY" },
      success_url: `${baseUrl}/orders/${result.order.id}?success=true`,
      cancel_url: `${baseUrl}/checkout/cancel?orderId=${result.order.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });
    createdStripeSessionId = stripeSession.id;
    await db.order.update({ where: { id: result.order.id }, data: { stripeSessionId: stripeSession.id } });
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    if (createdStripeSessionId) {
      try { await stripe.checkout.sessions.expire(createdStripeSessionId); } catch (expireError) { console.error("Could not expire failed checkout session:", expireError); }
    }
    if (reservedOrderId) await releasePendingOrder(reservedOrderId);
    const message = error instanceof Error ? error.message : "Payment could not be started";
    const unavailable = /sold out|available|quantity|Cart is empty/i.test(message);
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: unavailable ? message : "Failed to create checkout session" }, { status: unavailable ? 409 : 500 });
  }
}
