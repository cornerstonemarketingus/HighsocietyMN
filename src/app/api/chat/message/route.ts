import { NextResponse } from "next/server";
import { addChat, getProducts } from "@/lib/store";
import { getUserId } from "@/lib/session";

function makeReply(message: string) {
  const text = message.toLowerCase();
  if (text.includes("sleep")) {
    const product = getProducts().find((entry) => entry.effects.includes("Sleepy"));
    return `For sleep support, try ${product?.name}. It has ${product?.thc}% THC with ${product?.effects.join(", ")} effects.`;
  }
  if (text.includes("strong") || text.includes("thc")) {
    const product = [...getProducts()].sort((a, b) => b.thc - a.thc)[0];
    return `Our strongest option right now is ${product.name} at ${product.thc}% THC.`;
  }
  return "I can recommend products by effects, potency, flavor, and time of day. Try asking 'best for sleep'.";
}

export async function POST(request: Request) {
  const userId = await getUserId();
  const body = await request.json();
  const message = String(body.message ?? "");
  addChat(userId, "user", message);
  const reply = makeReply(message);
  addChat(userId, "assistant", reply);
  return NextResponse.json({ reply });
}
