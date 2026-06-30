import { NextResponse } from "next/server";
import { getChat } from "@/lib/store";
import { getUserId } from "@/lib/session";

export async function GET() {
  const userId = await getUserId();
  return NextResponse.json({ messages: getChat(userId) });
}
