import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const PLAY_COST = 5;
const WIN_TOKENS = 20;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in to play." }, { status: 401 });

  const { pick } = await req.json().catch(() => ({ pick: -1 })) as { pick: number };
  if (!Number.isInteger(pick) || pick < 0 || pick > 2) {
    return NextResponse.json({ error: "Choose one of the three jars." }, { status: 400 });
  }

  const prisma = db as any;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { tokens: true } }) as { tokens: number } | null;
  if (!user || user.tokens < PLAY_COST) return NextResponse.json({ error: "You need 5 tokens to play." }, { status: 400 });

  const winningIndex = Math.floor(Math.random() * 3);
  const won = pick === winningIndex;
  const netChange = (won ? WIN_TOKENS : 0) - PLAY_COST;

  await prisma.$transaction([
    prisma.user.update({ where: { id: session.user.id }, data: { tokens: { increment: netChange } } }),
    prisma.tokenTransaction.create({ data: { userId: session.user.id, tokens: -PLAY_COST, reason: "terpene_match_play" } }),
    ...(won ? [prisma.tokenTransaction.create({ data: { userId: session.user.id, tokens: WIN_TOKENS, reason: "terpene_match_win" } })] : []),
  ]);

  const updated = await prisma.user.findUnique({ where: { id: session.user.id }, select: { tokens: true } }) as { tokens: number } | null;
  return NextResponse.json({ winningIndex, won, winTokens: won ? WIN_TOKENS : 0, newBalance: updated?.tokens ?? 0 });
}
