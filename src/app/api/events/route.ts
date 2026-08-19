import { NextRequest, NextResponse } from "next/server";

const allowed = new Set(["product.added", "checkout.started"]);

export async function POST(request: NextRequest) {
  const body = await request.json() as { event?: string; properties?: Record<string, unknown> };
  if (!body.event || !allowed.has(body.event)) return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  const properties = Object.fromEntries(Object.entries(body.properties ?? {}).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value)).slice(0, 10));
  console.info(JSON.stringify({ event: body.event, properties, at: new Date().toISOString() }));
  return new NextResponse(null, { status: 204 });
}
