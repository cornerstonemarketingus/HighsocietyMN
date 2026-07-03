import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/store";
import { getUserId } from "@/lib/session";

export async function GET() {
  const userId = await getUserId();
  return NextResponse.json({ orders: listOrders(userId) });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  const body = await request.json();
  const order = createOrder({
    userId,
    items: body.items ?? [],
    tax: Number(body.tax ?? 0),
    subtotal: Number(body.subtotal ?? 0),
    total: Number(body.total ?? 0),
    fulfillmentType: body.fulfillmentType === "DELIVERY" ? "DELIVERY" : "PICKUP",
    scheduledFor: String(body.scheduledFor ?? new Date().toISOString()),
  });
  return NextResponse.json(order, { status: 201 });
}
